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
 * QuestionBankPage - Stripe 风格面试题库页面
 * 标题 weight 300 + 负 letter-spacing
 * Chip 改为 Stripe pill 风格
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 300,
            letterSpacing: '-0.288px',
            color: '#061b31',
          }}
        >
          面试题库
        </Typography>
        <Chip
          label={`${filteredQuestions.length} 题`}
          size="small"
          sx={{
            borderRadius: '4px',
            bgcolor: 'rgba(83,58,253,0.08)',
            color: '#533afd',
            fontWeight: 500,
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
              borderRadius: '4px',
              bgcolor: 'rgba(21,190,83,0.15)',
              color: '#108c3d',
              fontWeight: 500,
              fontSize: '0.7rem',
              border: '1px solid rgba(21,190,83,0.3)',
            }}
          />
        )}
      </Box>

      {/* 搜索栏 — Stripe 风格输入框 */}
      <Box sx={{ mb: 2 }}>
        <SearchBar
          value={filters.keyword}
          onChange={(keyword) => updateFilters({ keyword })}
        />
      </Box>

      {/* 筛选器 — Stripe pill 风格 */}
      <QuestionFilter
        filters={filters}
        onFilterChange={updateFilters}
      />

      {/* 题目列表 */}
      <Grid container spacing={2}>
        {filteredQuestions.map((q) => (
          <Grid item xs={12} sm={6} md={4} key={q.id}>
            <QuestionCard
              question={q}
              isFavorite={favorites.includes(q.id)}
              onToggleFavorite={toggleFavorite}
              onViewDetail={selectQuestion}
            />
          </Grid>
        ))}
      </Grid>

      {filteredQuestions.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="body1" sx={{ color: '#64748d', fontWeight: 300 }}>
            没有找到匹配的题目，请调整筛选条件
          </Typography>
        </Box>
      )}

      {/* 答案弹窗 */}
      <AnswerDialog question={selectedQuestion} onClose={closeQuestion} />
    </Box>
  );
}

export default QuestionBankPage;
