import React from 'react';
import {
  Box,
  Typography,
  Rating,
} from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

/** 自定义图标 */
const customIcons = {
  1: { icon: <SentimentVeryDissatisfiedIcon />, label: '很差' },
  2: { icon: <SentimentDissatisfiedIcon />, label: '较差' },
  3: { icon: <SentimentSatisfiedIcon />, label: '一般' },
  4: { icon: <SentimentSatisfiedAltIcon />, label: '良好' },
  5: { icon: <SentimentVerySatisfiedIcon />, label: '很棒' },
};

function IconContainer(props) {
  const { value, ...other } = props;
  const iconData = customIcons[value];
  return <span {...other}>{iconData?.icon}</span>;
}

/**
 * FeelingRating - 感受评分组件（1-5 分表情）
 * @param {Object} props
 * @param {number} props.value - 当前评分
 * @param {Function} props.onChange - 评分变更回调
 */
function FeelingRating({ value, onChange }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Rating
        value={value}
        onChange={(_e, newValue) => onChange(newValue || 3)}
        IconContainerComponent={IconContainer}
        highlightSelectedOnly
        size="large"
      />
      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300 }}>
        {customIcons[value]?.label || '一般'}
      </Typography>
    </Box>
  );
}

export default FeelingRating;
