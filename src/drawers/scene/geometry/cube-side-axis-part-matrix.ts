import {EAxisPart} from '../../../state/models/EAxisPart';
import {ECubeSidePart} from '../../../state/models/ECubeSidePart';

export type CubeSideAxisPartMatrix = Array<
  [[EAxisPart, EAxisPart], ECubeSidePart]
>;

export const cubeSideAxisPartMatrix: CubeSideAxisPartMatrix = [
  [[EAxisPart.Center, EAxisPart.Center], ECubeSidePart.Center],
  [[EAxisPart.Center, EAxisPart.End], ECubeSidePart.Top],
  [[EAxisPart.End, EAxisPart.End], ECubeSidePart.TopRight],
  [[EAxisPart.End, EAxisPart.Center], ECubeSidePart.Right],
  [[EAxisPart.End, EAxisPart.Start], ECubeSidePart.BottomRight],
  [[EAxisPart.Center, EAxisPart.Start], ECubeSidePart.Bottom],
  [[EAxisPart.Start, EAxisPart.Start], ECubeSidePart.BottomLeft],
  [[EAxisPart.Start, EAxisPart.Center], ECubeSidePart.Left],
  [[EAxisPart.Start, EAxisPart.End], ECubeSidePart.TopLeft],
];
