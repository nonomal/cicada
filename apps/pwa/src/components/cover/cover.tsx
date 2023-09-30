import { ImgHTMLAttributes, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { ComponentSize } from '@/constants/style';
import useEvent from '@/utils/use_event';
import DefaultCover from '@/asset/default_cover.jpeg';
import { Shape } from './constants';

const SHAPE_MAP: Record<Shape, { css: ReturnType<typeof css> }> = {
  [Shape.CIRCLE]: {
    css: css`
      border-radius: 50%;
    `,
  },
  [Shape.SQUARE]: {
    css: css``,
  },
};
const Style = styled.img<{ shape: Shape }>`
  object-fit: cover;
  aspect-ratio: 1;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  ${({ shape }) => {
    const { css: shapeCss } = SHAPE_MAP[shape];
    return shapeCss;
  }}
`;
const preventDefault = (e) => e.preventDefault();

function Cover({
  size = ComponentSize.NORMAL,
  shape = Shape.SQUARE,
  src,
  style,
  ...props
}: {
  src: string;
  size?: number | string;
  shape?: Shape;
} & ImgHTMLAttributes<HTMLImageElement>) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const onError = useEvent(() => setCurrentSrc(DefaultCover));

  useEffect(() => {
    setCurrentSrc(src || DefaultCover);
  }, [src]);

  return (
    <Style
      loading="lazy"
      crossOrigin="anonymous"
      {...props}
      src={currentSrc}
      onError={onError}
      style={{
        ...style,
        width: size,
      }}
      shape={shape}
      onDragStart={preventDefault}
    />
  );
}

export default Cover;
