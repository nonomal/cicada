import styled from 'styled-components';
import IconButton from '@/components/icon_button';
import {
  MdRefresh,
  MdPlaylistAdd,
  MdOutlineEdit,
  MdOutlinePeopleAlt,
} from 'react-icons/md';
import { RequestStatus } from '@/constants';
import notice from '@/utils/notice';
import { t } from '@/i18n';
import upperCaseFirstLetter from '#/utils/upper_case_first_letter';
import playerEventemitter, {
  EventType as PlayerEventType,
} from '../../eventemitter';
import { Musicbill } from '../../constants';
import e, { EventType } from './eventemitter';

const Style = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

function Operation({ musicbill }: { musicbill: Musicbill }) {
  const { status, musicList } = musicbill;
  return (
    <Style>
      <IconButton
        disabled={status !== RequestStatus.SUCCESS}
        onClick={() =>
          musicList.length
            ? playerEventemitter.emit(
                PlayerEventType.ACTION_ADD_MUSIC_LIST_TO_PLAYLIST,
                {
                  musicList,
                },
              )
            : notice.error(upperCaseFirstLetter(t('no_music_in_musicbill')))
        }
      >
        <MdPlaylistAdd />
      </IconButton>
      <IconButton
        loading={status === RequestStatus.LOADING}
        disabled={status !== RequestStatus.SUCCESS}
        onClick={() =>
          playerEventemitter.emit(PlayerEventType.RELOAD_MUSICBILL, {
            id: musicbill.id,
            silence: false,
          })
        }
      >
        <MdRefresh />
      </IconButton>
      <IconButton onClick={() => e.emit(EventType.OPEN_EDIT_MENU, null)}>
        <MdOutlineEdit />
      </IconButton>
      <IconButton
        onClick={() =>
          playerEventemitter.emit(
            PlayerEventType.OPEN_MUSICBILL_SHARED_USER_DRAWER,
            { id: musicbill.id },
          )
        }
      >
        <MdOutlinePeopleAlt />
      </IconButton>
    </Style>
  );
}

export default Operation;
