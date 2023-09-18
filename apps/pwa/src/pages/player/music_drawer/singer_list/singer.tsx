import Cover, { Shape } from '@/components/cover';
import { CSSVariable } from '@/global_style';
import styled from 'styled-components';
import ellipsis from '@/style/ellipsis';
import getResizedImage from '@/server/asset/get_resized_image';
import { SingerDetail } from '../constants';
import e, { EventType } from '../../eventemitter';

const COVER_SIZE = 28;
const Style = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  height: 44px;
  padding: 0 10px;
  margin: 0 10px;

  transition: 300ms;
  cursor: pointer;
  background-color: transparent;

  > .name {
    flex: 1;
    min-width: 0;

    ${ellipsis}
    font-size: 16px;
    font-weight: bold;
    color: ${CSSVariable.TEXT_COLOR_PRIMARY};
  }

  &:hover {
    background-color: ${CSSVariable.BACKGROUND_COLOR_LEVEL_ONE};
  }

  &:active {
    background-color: ${CSSVariable.BACKGROUND_COLOR_LEVEL_TWO};
  }
`;

function Singer({ singer }: { singer: SingerDetail }) {
  return (
    <Style
      onClick={() => e.emit(EventType.OPEN_SINGER_DRAWER, { id: singer.id })}
    >
      <Cover
        size={COVER_SIZE}
        shape={Shape.CIRCLE}
        src={getResizedImage({ url: singer.avatar, size: COVER_SIZE * 2 })}
        alt="singer cover"
      />
      <div className="name">{singer.name}</div>
    </Style>
  );
}

export default Singer;
