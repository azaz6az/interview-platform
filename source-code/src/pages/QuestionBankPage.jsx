import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
} from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useQuestionBank } from '../contexts/QuestionBankContext';
import QuestionCard from '../modules/question-bank/components/QuestionCard';
import QuestionFilter from '../modules/question-bank/components/QuestionFilter';
import SearchBar from '../modules/question-bank/components/SearchBar';
import AnswerDialog from '../modules/question-bank/components/AnswerDialog';

/**
 * QuestionBankPage - 面试题库页面（视觉增强版）
 * 入场动画 + Chip 渐变风格
 */
function QuestionBankPage() {
  const {
    filteredQuestions,
    filters,
    favorites,
    selectedQuestion,
    updateFilters,
    toggleFavorite,
    selectQuestion,
    closeQuestion,
  } = useQuestionBank();

  return (
    <Box>
      {/* 标题栏 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 2,
          animation: 'fadeInUp 0.4s ease-out',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 300,
            letterSpacing: '-0.288px',
            color: 'text.primary',
          }}
        >
          面试题库
        </Typography>
        <Chip
          label={`${filteredQuestions.length} 题`}
          size="small"
          sx={{
            borderRadius: 1.5,
            background: 'linear-gradient(135deg, rgba(83,58,253,0.1) 0%, rgba(124,58,237,0.1) 100%)',
            color: '#533afd',
            fontWeight: 600,
            fontSize: '0.7rem',
            border: '1px solid #b9b9f9',
          }}
        />
        {favorites.length > 0 && (
          <Chip
            icon={<LocalFireDepartmentIcon />}
            label={`${favorites.length} 收藏`}
            size="small"
            sx={{
              borderRadius: 1.5,
              bgcolor: 'rgba(21,190,83,0.1)',
              color: '#108c3d',
              fontWeight: 600,
              fontSize: '0.7rem',
              border: '1px solid rgba(21,190,83,0.25)',
            }}
          />
        )}
      </Box>

      {/* 搜索栏 */}
      <Box sx={{ mb: 2, animation: 'fadeInUp 0.4s ease-out 0.05s both' }}>
        <SearchBar
          value={filters.keyword}
          onChange={(keyword) => updateFilters({ keyword })}
        />
      </Box>

      {/* 筛选器 */}
      <Box sx={{ animation: 'fadeInUp 0.4s ease-out 0.1s both' }}>
        <QuestionFilter
          filters={filters}
          onFilterChange={updateFilters}
        />
      </Box>

      {/* 题目列表 */}
      <Grid container spacing={2.5}>
        {filteredQuestions.map((q, idx) => (
          <Grid item xs={12} sm={6} md={4} key={q.id}>
            <Box sx={{ animation: `fadeInUp 0.4s ease-out ${Math.min(idx * 0.04, 0.4)}s both` }}>
              <QuestionCard
                question={q}
                isFavorite={favorites.includes(q.id)}
                onToggleFavorite={toggleFavorite}
                onViewDetail={selectQuestion}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      {filteredQuestions.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            animation: 'fadeIn 0.5s ease-out',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: '#f5f3ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              fontSize: '2rem',
            }}
          >
            📚
          </Box>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 400 }}>
            没有找到匹配的题目
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300, mt: 0.5 }}>
            请调整筛选条件或搜索关键词
          </Typography>
        </Box>
      )}

      {/* 答案弹窗 */}
      <AnswerDialog question={selectedQuestion} onClose={closeQuestion} />
    </Box>
  );
}

export default QuestionBankPage;
