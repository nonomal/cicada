import styled from 'styled-components';
import Spinner from '@/components/spinner';
import { flexCenter } from '@/style/flexbox';
import Empty from '@/components/empty';
import Pagination from '@/components/pagination';
import { CSSProperties, useCallback } from 'react';
import ErrorCard from '@/components/error_card';
import useNavigate from '@/utils/use_navigate';
import { Query } from '@/constants';
import { animated, useTransition } from 'react-spring';
import absoluteFullSize from '@/style/absolute_full_size';
import Button, { Variant } from '@/components/button';
import autoScrollbar from '@/style/auto_scrollbar';
import { t } from '@/i18n';
import { HEADER_HEIGHT } from '../../../constants';
import useMusicList from './use_music_list';
import { PAGE_SIZE, TOOLBAR_HEIGHT } from '../constants';
import Music from './music';

const Style = styled.div`
  flex: 1;
  min-height: 0;

  position: relative;
`;
const Container = styled(animated.div)`
  ${absoluteFullSize}

  padding-top: ${HEADER_HEIGHT}px;
`;
const CardContainer = styled(Container)`
  ${flexCenter}

  flex-direction: column;
  gap: 20px;
`;
const MusicListContainer = styled(Container)`
  padding-bottom: ${TOOLBAR_HEIGHT}px;

  overflow: auto;
  ${autoScrollbar}
`;
const paginationStyle: CSSProperties = {
  margin: '10px 0',
};

function MusicList() {
  const navigate = useNavigate();

  const onPageChange = useCallback(
    (p: number) =>
      navigate({
        query: {
          [Query.PAGE]: p,
        },
      }),
    [navigate],
  );

  const { page, data, reload } = useMusicList();

  const transitions = useTransition(data, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });
  return (
    <Style>
      {transitions((style, d) => {
        const { error, loading, value } = d;
        if (error) {
          return (
            <CardContainer style={style}>
              <ErrorCard errorMessage={error.message} retry={reload} />
            </CardContainer>
          );
        }
        if (loading) {
          return (
            <CardContainer style={style}>
              <Spinner />
            </CardContainer>
          );
        }

        if (!value!.total && !value!.musicList.length) {
          return (
            <CardContainer style={style}>
              <Empty description={t('no_suitable_music')} />
              <Button
                variant={Variant.PRIMARY}
                onClick={() =>
                  navigate({
                    query: {
                      [Query.CREATE_MUSIC_DIALOG_OPEN]: 1,
                    },
                  })
                }
              >
                {t('create_music')}
              </Button>
            </CardContainer>
          );
        }

        return (
          <MusicListContainer style={style}>
            <div className="list">
              {value!.musicList.map((music) => (
                <Music key={music.id} music={music} />
              ))}
            </div>
            {value!.total ? (
              <Pagination
                style={paginationStyle}
                total={value!.total}
                pageSize={PAGE_SIZE}
                page={page}
                onChange={onPageChange}
              />
            ) : null}
          </MusicListContainer>
        );
      })}
    </Style>
  );
}

export default MusicList;
