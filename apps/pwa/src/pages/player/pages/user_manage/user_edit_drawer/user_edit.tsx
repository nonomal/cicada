import styled from 'styled-components';
import Input from '@/components/input';
import Textarea from '@/components/textarea';
import Button, { Variant } from '@/components/button';
import day from '#/utils/day';
import { ChangeEventHandler, useState } from 'react';
import logger from '@/utils/logger';
import notice from '@/utils/notice';
import dialog from '@/utils/dialog';
import adminUpdateUser from '@/server/api/admin_update_user';
import adminUpdateUserAdmin from '@/server/api/admin_update_user_admin';
import { AdminAllowUpdateKey, REMARK_MAX_LENGTH } from '#/constants/user';
import adminDeleteUser from '@/server/api/admin_delete_user';
import { t } from '@/i18n';
import { User } from '../constants';
import e, { EventType } from '../eventemitter';

const Style = styled.div`
  > .part {
    margin: 20px;
    display: block;
    width: calc(100% - 40px);
  }
`;

function UserEdit({ user, onClose }: { user: User; onClose: () => void }) {
  const [musicbillMaxAmount, setMusicbillMaxAmount] = useState(() =>
    user.musicbillMaxAmount.toString(),
  );
  const onMusicbillMacAmountChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => setMusicbillMaxAmount(event.target.value.replace(/[\D.]/, ''));

  const [createMusicMaxAmountPerDay, setCreateMusicMaxAmountPerDay] = useState(
    () => user.createMusicMaxAmountPerDay.toString(),
  );
  const onCreateMusicMaxAmountPerDayChange: ChangeEventHandler<
    HTMLInputElement
  > = (event) =>
    setCreateMusicMaxAmountPerDay(event.target.value.replace(/[\D.]/, ''));

  const [musicPlayRecordIndate, setMusicPlayRecordIndate] = useState(() =>
    user.musicPlayRecordIndate.toString(),
  );
  const onMusicPlayRecordIndateChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => setMusicPlayRecordIndate(event.target.value.replace(/[\D.]/, ''));

  const [remark, setRemark] = useState(user.remark);
  const onRemarkChange: ChangeEventHandler<HTMLTextAreaElement> = (event) =>
    setRemark(event.target.value);

  const [loading, setLoading] = useState(false);
  const onSave = async () => {
    setLoading(true);

    try {
      const musicbillMaxAmountNumber = Number(musicbillMaxAmount);
      if (user.musicbillMaxAmount !== musicbillMaxAmountNumber) {
        if (musicbillMaxAmountNumber < 0) {
          throw new Error(
            t('should_be_greater_than', t('maximum_amount_of_musicbill'), '0'),
          );
        }
        await adminUpdateUser({
          id: user.id,
          key: AdminAllowUpdateKey.MUSICBILL_MAX_AMOUNT,
          value: musicbillMaxAmountNumber,
        });
        e.emit(EventType.USER_UPDATED, {
          id: user.id,
          musicbillMaxAmount: musicbillMaxAmountNumber,
        });
      }

      const createMusicMaxAmountPerDayNumber = Number(
        createMusicMaxAmountPerDay,
      );
      if (
        user.createMusicMaxAmountPerDay !== createMusicMaxAmountPerDayNumber
      ) {
        if (createMusicMaxAmountPerDayNumber < 0) {
          throw new Error(
            t(
              'should_be_greater_than_or_equal_to',
              t('maximum_amount_of_creating_music_per_day'),
              '0',
            ),
          );
        }
        await adminUpdateUser({
          id: user.id,
          key: AdminAllowUpdateKey.CREATE_MUSIC_MAX_AMOUNT_PER_DAY,
          value: createMusicMaxAmountPerDayNumber,
        });
        e.emit(EventType.USER_UPDATED, {
          id: user.id,
          createMusicMaxAmountPerDay: createMusicMaxAmountPerDayNumber,
        });
      }

      const musicPlayRecordIndateNumber = Number(musicPlayRecordIndate);
      if (user.musicPlayRecordIndate !== musicPlayRecordIndateNumber) {
        if (musicPlayRecordIndateNumber < 0) {
          throw new Error(
            t(
              'should_be_greater_than_or_equal_to',
              t('music_play_record_indate'),
              '0',
            ),
          );
        }
        await adminUpdateUser({
          id: user.id,
          key: AdminAllowUpdateKey.MUSIC_PLAY_RECORD_INDATE,
          value: musicPlayRecordIndateNumber,
        });
        e.emit(EventType.USER_UPDATED, {
          id: user.id,
          musicPlayRecordIndate: musicPlayRecordIndateNumber,
        });
      }

      if (user.remark !== remark) {
        if (remark.length > REMARK_MAX_LENGTH) {
          throw new Error(
            t(
              'should_be_less_than_or_equal_to',
              t('length_of', t('remark')),
              REMARK_MAX_LENGTH.toString(),
            ),
          );
        }
        await adminUpdateUser({
          id: user.id,
          key: AdminAllowUpdateKey.REMARK,
          value: remark,
        });
        e.emit(EventType.USER_UPDATED, {
          id: user.id,
          remark,
        });
      }

      window.setTimeout(() => onClose(), 0);
    } catch (error) {
      logger.error(error, 'Failed to update user info');
      notice.error(error.message);
    }

    setLoading(false);
  };

  return (
    <Style>
      <Style>
        <Input
          className="part"
          label="ID"
          disabled
          inputProps={{ defaultValue: user.id }}
        />
        <Input
          className="part"
          label={t('nickname')}
          disabled
          inputProps={{ defaultValue: user.nickname }}
        />
        <Input
          className="part"
          label={t('email')}
          disabled
          inputProps={{ defaultValue: user.email }}
        />
        <Input
          className="part"
          label={t('join_time')}
          disabled
          inputProps={{
            defaultValue: day(user.joinTimestamp).format('YYYY-MM-DD'),
          }}
        />
        <Input
          className="part"
          label={`${t('maximum_amount_of_musicbill')}(${t(
            'zero_means_unlimited',
          )})`}
          disabled={loading}
          inputProps={{
            value: musicbillMaxAmount,
            onChange: onMusicbillMacAmountChange,
          }}
        />
        <Input
          className="part"
          label={`${t('maximum_amount_of_creating_music_per_day')}(${t(
            'zero_means_unlimited',
          )})`}
          disabled={loading}
          inputProps={{
            value: createMusicMaxAmountPerDay,
            onChange: onCreateMusicMaxAmountPerDayChange,
          }}
        />
        <Input
          className="part"
          label={`${t('music_play_record_indate')}(${t(
            'zero_means_unlimited',
          )})`}
          disabled={loading}
          inputProps={{
            value: musicPlayRecordIndate,
            onChange: onMusicPlayRecordIndateChange,
          }}
        />
        <Textarea
          className="part"
          label={t('remark')}
          disabled={loading}
          textareaProps={{ value: remark, onChange: onRemarkChange, rows: 5 }}
        />
        <Button
          className="part"
          variant={Variant.PRIMARY}
          onClick={onSave}
          loading={loading}
        >
          {t('save')}
        </Button>
        {user.admin ? null : (
          <Button
            className="part"
            disabled={loading}
            onClick={() =>
              dialog.confirm({
                title: t('set_as_admin_question'),
                content: t('set_as_admin_question_content'),
                confirmText: t('continue'),
                onConfirm: () =>
                  void dialog.captcha({
                    confirmText: t('set_as_admin'),
                    confirmVariant: Variant.PRIMARY,
                    onConfirm: async ({ captchaId, captchaValue }) => {
                      try {
                        await adminUpdateUserAdmin({
                          id: user.id,
                          captchaId,
                          captchaValue,
                        });
                        onClose();
                        e.emit(EventType.USER_UPDATED, {
                          id: user.id,
                          admin: 1,
                        });
                      } catch (error) {
                        logger.error(error, 'Failed to set admin');
                        notice.error(error.message);
                        return false;
                      }
                    },
                  }),
              })
            }
          >
            {t('set_as_admin')}
          </Button>
        )}
        {user.admin ? null : (
          <Button
            className="part"
            variant={Variant.DANGER}
            disabled={loading}
            onClick={() =>
              dialog.confirm({
                title: t('delete_user_question'),
                content: t('delete_user_question_content'),
                confirmText: t('continue'),
                onConfirm: () =>
                  void dialog.captcha({
                    confirmText: t('delete_user'),
                    confirmVariant: Variant.DANGER,
                    onConfirm: async ({ captchaId, captchaValue }) => {
                      try {
                        await adminDeleteUser({
                          id: user.id,
                          captchaId,
                          captchaValue,
                        });
                        onClose();
                        e.emit(EventType.USER_DELETED, { id: user.id });
                      } catch (error) {
                        logger.error(error, 'Failed to delete user');
                        notice.error(error.message);
                        return false;
                      }
                    },
                  }),
              })
            }
          >
            {t('delete_user')}
          </Button>
        )}
      </Style>
    </Style>
  );
}

export default UserEdit;
