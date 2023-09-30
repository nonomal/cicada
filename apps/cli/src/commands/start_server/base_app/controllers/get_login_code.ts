import { encode } from 'html-entities';
import { EMAIL } from '#/constants/regexp';
import { ExceptionCode } from '#/constants/exception';
import { getDB } from '@/db';
import { verifyCaptcha } from '@/platform/captcha';
import {
  hasLoginCodeInGetInterval,
  saveLoginCode,
} from '@/platform/login_code';
import generateRandomInteger from '#/utils/generate_random_integer';
import { sendEmail } from '@/platform/email';
import day from '#/utils/day';
import { getConfig } from '@/config';
import capitalize from '#/utils/capitalize';
import upperCaseFirstLetter from '#/utils/upper_case_first_letter';
import { User, UserProperty, USER_TABLE_NAME } from '@/constants/db_definition';
import { LOGIN_CODE_TTL } from '../../../../constants';
import { Context } from '../constants';

export default async (ctx: Context) => {
  const { email, captchaId, captchaValue } = ctx.query as {
    email?: unknown;
    captchaId?: unknown;
    captchaValue?: unknown;
  };

  if (
    typeof email !== 'string' ||
    !EMAIL.test(email) ||
    typeof captchaId !== 'string' ||
    !captchaId.length ||
    typeof captchaValue !== 'string' ||
    !captchaValue.length
  ) {
    return ctx.except(ExceptionCode.PARAMETER_ERROR);
  }

  const captchaVerified = await verifyCaptcha({
    id: captchaId,
    value: captchaValue,
  });
  if (!captchaVerified) {
    return ctx.except(ExceptionCode.CAPTCHA_ERROR);
  }

  const user = await getDB().get<
    Pick<User, UserProperty.ID | UserProperty.NICKNAME>
  >(
    `
      SELECT
        ${UserProperty.ID},
        ${UserProperty.NICKNAME}
      FROM ${USER_TABLE_NAME}
      WHERE ${UserProperty.EMAIL} = ?
    `,
    [email],
  );
  if (!user) {
    return ctx.except(ExceptionCode.USER_NOT_EXISTED);
  }

  const hasLoginCodeAlready = await hasLoginCodeInGetInterval({
    userId: user.id,
  });
  if (hasLoginCodeAlready) {
    return ctx.except(ExceptionCode.ALREADY_GOT_LOGIN_CODE_BEFORE);
  }

  const code = generateRandomInteger(100000, 1000000).toString();

  /**
   * 开发模式下在控制台输出
   * @author mebtte<hi@mebtte.com>
   */
  if (getConfig().mode === 'development') {
    // eslint-disable-next-line no-console
    console.log(`\n--- user id: ${user.id}, login code: ${code} ---\n`);
  }
  await sendEmail({
    to: email,
    title: capitalize(`${ctx.t('cicada')} ${ctx.t('login_code')}`),
    html: `
        Hi, ${encode(user.nickname)},
        <br />
        <br />
        ${upperCaseFirstLetter(
          ctx.t(
            'login_code_email_content',
            `<code>${code}</code>`,
            (LOGIN_CODE_TTL / 1000 / 60).toString(),
          ),
        )}
        <br />
        <br />
        ${capitalize(ctx.t('cicada'))}
        <br />
        ${day().format('YYYY-MM-DD HH:mm:ss')}
      `,
    fromName: capitalize(ctx.t('cicada')),
  });

  /**
   * 如果 Promise.all 发送邮件和写入数据库
   * 邮件服务不一定稳定
   * 可能会出现写入数据成功 但是发送邮件失败
   * 因为获取登录验证有时间间隔
   * 导致用户需要等待一段时候后才能重试
   * @author mebtte<hi@mebtte.com>
   */
  await saveLoginCode({ userId: user.id, code });

  return ctx.success(null);
};
