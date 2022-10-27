import styled from 'styled-components';
import Drawer from '#/components/drawer';
import { CSSProperties, UIEventHandler, useState } from 'react';
import { animated, useTransition } from 'react-spring';
import absoluteFullSize from '#/style/absolute_full_size';
import { flexCenter } from '#/style/flexbox';
import ErrorCard from '@/components/error_card';
import Spinner from '#/components/spinner';
import useData from './use_data';
import { MINI_INFO_HEIGHT, SingerDetail } from './constants';
import Info from './info';
import Toolbar from './toolbar';
import MusicList from './music_list';
import CreateUser from './create_user';
import MiniIfno from './mini_info';

const bodyProps: { style: CSSProperties } = {
  style: {
    width: '90%',
    maxWidth: 450,
  },
};
const Container = styled(animated.div)`
  ${absoluteFullSize}
`;
const CardContainer = styled(Container)`
  ${flexCenter}
`;
const DetailContainer = styled(Container)`
  > .scrollable {
    ${absoluteFullSize}

    overflow: auto;
  }
`;

function Detail({
  style,
  singer,
  reload,
}: {
  style: unknown;
  singer: SingerDetail;
  reload: () => void;
}) {
  const [toolbarSticky, setToolbarSticky] = useState(false);

  const onScroll: UIEventHandler<HTMLDivElement> = (event) => {
    const { scrollTop, clientWidth } = event.target as HTMLDivElement;
    setToolbarSticky(scrollTop >= clientWidth - MINI_INFO_HEIGHT);
  };
  return (
    // @ts-expect-error
    <DetailContainer style={style}>
      <div className="scrollable" onScroll={onScroll}>
        <Info singer={singer} />
        <Toolbar sticky={toolbarSticky} reload={reload} singer={singer} />
        <MusicList musicList={singer.musicList} />
        <CreateUser user={singer.createUser} createTime={singer.createTime} />
      </div>

      {toolbarSticky ? <MiniIfno singer={singer} /> : null}
    </DetailContainer>
  );
}

function SingerDrawer({
  zIndex,
  open,
  onClose,
  singerId,
}: {
  zIndex: number;
  open: boolean;
  onClose: () => void;
  singerId: string;
}) {
  const { data, reload } = useData(singerId);

  const transitions = useTransition(data, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });
  return (
    <Drawer
      open={open}
      onClose={onClose}
      maskProps={{ style: { zIndex } }}
      bodyProps={bodyProps}
    >
      {transitions((style, d) => {
        if (d.error) {
          return (
            <CardContainer style={style}>
              <ErrorCard errorMessage="xxx" retry={reload} />
            </CardContainer>
          );
        }
        if (d.loading) {
          return (
            <CardContainer style={style}>
              <Spinner />
            </CardContainer>
          );
        }
        return <Detail style={style} singer={d.singer!} reload={reload} />;
      })}
    </Drawer>
  );
}

export default SingerDrawer;
