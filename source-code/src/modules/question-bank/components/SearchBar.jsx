import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

/**
 * SearchBar - Stripe 风格搜索栏
 * 4px 圆角 + #e5edf5 边框 + Inter 字体
 * @param {Object} props
 * @param {string} props.value - 当前搜索关键词
 * @param {Function} props.onChange - 搜索词变更回调
 */
function SearchBar({ value, onChange }) {
  return (
    <TextField
      fullWidth
      size="small"
      placeholder="搜索题目关键词..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '4px',
          bgcolor: 'background.paper',
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 300,
          '& fieldset': {
            borderColor: 'divider',
          },
          '&:hover fieldset': {
            borderColor: '#b9b9f9',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#533afd',
          },
        },
      }}
    />
  );
}

export default SearchBar;
