import { CSSProperties, useContext } from 'react';
import styled from 'styled-components';
import List from 'react-list';
import IconButton from '@/components/icon_button';
import {
  MdOutlineLocationOn,
  MdOutlineClose,
  MdArrowUpward,
  MdArrowDownward,
  MdShuffle,
} from 'react-icons/md';
import { ComponentSize } from '@/constants/style';
import { flexCenter } from '@/style/flexbox';
import Empty from '@/components/empty';
import absoluteFullSize from '@/style/absolute_full_size';
import { CSSVariable } from '@/global_style';
import autoScrollbar from '@/style/auto_scrollbar';
import { t } from '@/i18n';
import Context from '../context';
import TabContent from './tab_content';
import MusicBase from '../components/music_base';
import { TAB_LIST_HEIGHT } from './constants';
import playerEventemitter, {
  EventType as PlayerEventType,
} from '../eventemitter';

const shuffleStyle: CSSProperties = {
  width: ComponentSize.SMALL,
  color: CSSVariable.COLOR_PRIMARY,
};
const Style = styled(TabContent)`
  > .content {
    ${absoluteFullSize}

    padding-top: ${TAB_LIST_HEIGHT}px;
    padding-bottom: env(safe-area-inset-bottom, 0);

    &.list {
      overflow: auto;
      ${autoScrollbar}
    }

    &.empty {
      ${flexCenter}
    }
  }
`;
const Operation = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
const removeStyle: CSSProperties = {
  color: CSSVariable.COLOR_DANGEROUS,
};

function Playqueue({ style }: { style: unknown }) {
  const { currentPlayqueuePosition, playqueue } = useContext(Context);

  const { length } = playqueue;
  return (
    // @ts-expect-error
    <Style style={style}>
      {playqueue.length ? (
        <div className="content list">
          <List
            type="uniform"
            length={length}
            // eslint-disable-next-line react/no-unstable-nested-components
            itemRenderer={(index, key) => {
              const actualIndex = length - index - 1;
              const queueMusic = playqueue[actualIndex];
              return (
                <MusicBase
                  key={key}
                  index={queueMusic.index}
                  music={queueMusic}
                  active={actualIndex === currentPlayqueuePosition}
                  lineAfter={
                    <Operation>
                      {queueMusic.shuffle ? (
                        <MdShuffle
                          style={shuffleStyle}
                          title={t('pick_from_playlist_randomly')}
                        />
                      ) : null}
                      {actualIndex === currentPlayqueuePosition ? null : (
                        <IconButton
                          title={t('relocate_to_here')}
                          size={ComponentSize.SMALL}
                          onClick={(e) => {
                            e.stopPropagation();
                            return playerEventemitter.emit(
                              PlayerEventType.ACTION_PLAY_PLAYQUEUE_INDEX,
                              {
                                index: actualIndex,
                              },
                            );
                          }}
                        >
                          <MdOutlineLocationOn />
                        </IconButton>
                      )}
                      {actualIndex < length - 1 &&
                      actualIndex > currentPlayqueuePosition ? (
                        <IconButton
                          size={ComponentSize.SMALL}
                          onClick={(e) => {
                            e.stopPropagation();
                            return playerEventemitter.emit(
                              PlayerEventType.ACTION_MOVE_PLAYQUEUE_MUSIC_LATER,
                              {
                                queueMusic,
                              },
                            );
                          }}
                        >
                          <MdArrowUpward />
                        </IconButton>
                      ) : null}
                      {actualIndex > currentPlayqueuePosition + 1 ? (
                        <IconButton
                          size={ComponentSize.SMALL}
                          onClick={(e) => {
                            e.stopPropagation();
                            return playerEventemitter.emit(
                              PlayerEventType.ACTION_MOVE_PLAYQUEUE_MUSIC_EARLY,
                              {
                                queueMusic,
                              },
                            );
                          }}
                        >
                          <MdArrowDownward />
                        </IconButton>
                      ) : null}
                      {actualIndex > currentPlayqueuePosition ? (
                        <IconButton
                          size={ComponentSize.SMALL}
                          style={removeStyle}
                          onClick={(e) => {
                            e.stopPropagation();
                            return playerEventemitter.emit(
                              PlayerEventType.ACTION_REMOVE_PLAYQUEUE_MUSIC,
                              {
                                queueMusic,
                              },
                            );
                          }}
                        >
                          <MdOutlineClose />
                        </IconButton>
                      ) : null}
                    </Operation>
                  }
                />
              );
            }}
          />
        </div>
      ) : (
        <div className="content empty">
          <Empty description={t('empty_playqueue')} />
        </div>
      )}
    </Style>
  );
}

export default Playqueue;
