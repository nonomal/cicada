import styled from 'styled-components';
import { t } from './i18n';
import absoluteFullSize from './style/absolute_full_size';

const Style = styled.div`
  ${absoluteFullSize}

  display: flex;
  flex-direction: column;
  justify-content: center;

  > .tips {
    text-align: center;
    margin: 20px;
  }

  > .list {
    text-align: center;

    > .item {
      display: block;
      margin: 10px 20px;
    }
  }
`;

function Unsupported({ unsupportedList }: { unsupportedList: string[] }) {
  return (
    <Style>
      <div className="tips">{t('incompatible_tips')}</div>
      <div className="list">
        {unsupportedList.map((us) => (
          <a
            key={us}
            className="item"
            href={us}
            target="_blank"
            rel="noopener noreferrer"
          >
            {us}
          </a>
        ))}
      </div>
    </Style>
  );
}

export default Unsupported;
