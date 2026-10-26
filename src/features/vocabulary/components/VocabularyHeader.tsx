import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  LinearProgress,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'

interface VocabularyHeaderProps {
  learnedWords: number
  totalWords: number
  onReset: () => void
  onMenuClick: () => void
}

export function VocabularyHeader({
  learnedWords,
  totalWords,
  onReset,
  onMenuClick,
}: VocabularyHeaderProps) {
  const progress = totalWords ? (learnedWords / totalWords) * 100 : 0

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 72, md: 80 } }}>
          <IconButton
            onClick={onMenuClick}
            aria-label="Mở menu"
            sx={{ display: { xs: 'inline-flex', md: 'none' }, mr: 1 }}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2.5,
              bgcolor: 'primary.main',
              color: 'common.white',
              display: { xs: 'none', sm: 'grid' },
              placeItems: 'center',
              mr: 1.5,
            }}
          >
            <AutoStoriesOutlinedIcon />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              component="h1"
              noWrap
              sx={{ fontSize: { xs: 16, md: 20 }, fontWeight: 750 }}
            >
              1000 từ vựng cơ bản
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Học từng chút, tiến bộ mỗi ngày
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ ml: 'auto' }}
          >
            <Box sx={{ width: { xs: 92, sm: 180 } }}>
              <Stack direction="row" justifyContent="space-between" mb={0.75}>
                <Typography variant="caption" color="text.secondary">
                  Tiến độ
                </Typography>
                <Typography variant="caption" fontWeight={700}>
                  {learnedWords}/{totalWords}
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 6, borderRadius: 10 }}
              />
            </Box>
            <Button
              color="inherit"
              onClick={onReset}
              startIcon={<RestartAltRoundedIcon />}
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Đặt lại
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
