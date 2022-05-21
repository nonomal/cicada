import { memo, useCallback } from 'react';
import styled from 'styled-components';

import { Figure } from '../../constants';
import eventemitter, { EventType } from '../../eventemitter';

const Style = styled.span`
  &::after {
    content: '|';
    color: var(--text-color-secondary);
    margin: 0 2px;
  }
  &:last-child::after {
    content: '';
    margin: 0;
  }
  > .singer {
    font-size: inherit;
    cursor: pointer;
    color: var(--text-color-secondary);
    &.unknown {
      color: var(--text-color-secondary) !important;
      cursor: not-allowed;
    }
    &:hover {
      color: var(--text-color-primary);
    }
  }
`;

function Singer({ singer }: { singer?: Figure }) {
  const onViewSinger = useCallback(
    () =>
      singer
        ? eventemitter.emit(EventType.OPEN_SINGER_DRAWER, { id: singer.id })
        : null,
    [singer],
  );
  return (
    <Style>
      {singer ? (
        <span className="singer" onClick={onViewSinger}>
          {singer.name}
        </span>
      ) : (
        <span className="singer unknown">未知歌手</span>
      )}
    </Style>
  );
}

export default memo(Singer);