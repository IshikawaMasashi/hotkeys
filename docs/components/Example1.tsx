import * as React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
// import { Split, SplitOrientation, SplitInfo } from "../../src";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeUp from "@material-ui/icons/VolumeUp";

const { useEffect, useRef, useState } = React;

// スタイルを定義
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(6)
    },
    title: {
      borderBottom: `2px solid ${theme.palette.primary.main}`
    },
    paper: {
      padding: 18
    }
  })
);

// props の型を定義
type Props = {
  title?: string;
};

// コンポーネントを定義
function Example1({ title }: Props) {
  // ここでクラス名を取得
  const classes = useStyles({});
  const [itemSize, setItemSize] = useState<number | number[]>(50);
  const handleChange = (event: any, newValue: number | number[]) => {
    setItemSize(newValue < 18 ? 18 : newValue);
  };
  // const [splits, setSplits] = useState<SplitInfo[]>([
  //   {
  //     min: 300,
  //     max: 600,
  //     value: 300
  //   },
  //   {
  //     min: 256
  //   }
  // ]);
  // const renderItem = ({
  //   style,
  //   index
  // }: {
  //   style: ItemStyle;
  //   index: number;
  // }) => {
  //   return (
  //     <div className="Row" style={style} key={index}>
  //       Row #{index}
  //     </div>
  //   );
  // };

  return (
    <div className={classes.root}>
      <div style={{ width: "100%" }}>
      </div>
    </div>
  );
}

export default Example1;
