import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import HeadphonesRoundedIcon from '@mui/icons-material/HeadphonesRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import {
  Avatar,
  Box,
  Button,
  Chip,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { BrandMark } from '../../../shared/components/BrandMark'
import { useAuth } from '../../auth/hooks/useAuth'

export const navigation_width = 250

interface AppNavigationProps {
  mobile_open: boolean
  on_mobile_close: () => void
}

const navigation_items = [
  {
    label: 'Trang chủ',
    icon: <HomeRoundedIcon />,
    active: false,
    coming_soon: false,
  },
  {
    label: '1000 từ vựng',
    icon: <AutoStoriesRoundedIcon />,
    active: true,
    coming_soon: false,
  },
  {
    label: 'Ngữ pháp',
    icon: <MenuBookRoundedIcon />,
    active: false,
    coming_soon: true,
  },
  {
    label: 'Luyện nghe',
    icon: <HeadphonesRoundedIcon />,
    active: false,
    coming_soon: true,
  },
  {
    label: 'Thống kê',
    icon: <BarChartRoundedIcon />,
    active: false,
    coming_soon: true,
  },
]

function initials_of(name: string) {
  // An email has no spaces, so only its local part is used.
  const base = name.split('@')[0]
  const parts = base.split(/\s+/).filter(Boolean)
  const letters =
    parts.length > 1
      ? parts[0][0] + parts[parts.length - 1][0]
      : base.slice(0, 2)
  return letters.toLocaleUpperCase()
}

function NavigationContent() {
  const { user, logout } = useAuth()
  const display_name = user?.display_name || user?.email || ''

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        px: 2,
        py: 3,
      }}
    >
      <Box sx={{ px: 1 }}>
        <BrandMark />
      </Box>

      <List disablePadding sx={{ mt: 5 }}>
        {navigation_items.map((item) => (
          <ListItemButton
            key={item.label}
            selected={item.active}
            disabled={item.coming_soon}
            aria-current={item.active ? 'page' : undefined}
            sx={{
              minHeight: 48,
              borderRadius: '12px',
              mb: 0.75,
              px: 1.5,
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
                bgcolor: 'secondary.main',
                '&:hover': { bgcolor: 'secondary.main' },
              },
              '&.Mui-disabled': { opacity: 0.7 },
            }}
          >
            <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              slotProps={{
                primary: {
                  fontSize: 14,
                  fontWeight: item.active ? 600 : 500,
                },
              }}
            />
            {item.coming_soon && (
              <Chip
                label="Sắp có"
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.68rem',
                  fontWeight: 500,
                  bgcolor: 'background.muted',
                  color: 'text.secondary',
                }}
              />
            )}
          </ListItemButton>
        ))}
      </List>

      <Stack spacing={2.5} sx={{ mt: 'auto', pt: 4 }}>
        <Box sx={{ borderRadius: '16px', bgcolor: 'background.default', p: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.7 }}
          >
            Học mỗi ngày,
            <br />
            tiến bộ mỗi ngày.
          </Typography>
        </Box>

        {user && (
          <>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  fontSize: 14,
                  fontWeight: 600,
                  bgcolor: 'secondary.main',
                  color: 'secondary.contrastText',
                }}
              >
                {initials_of(display_name)}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {display_name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{ display: 'block' }}
                >
                  {user.email}
                </Typography>
              </Box>
            </Stack>
            <Button
              startIcon={<LogoutRoundedIcon />}
              onClick={() => void logout()}
              sx={{ justifyContent: 'flex-start', px: 1.5 }}
            >
              Đăng xuất
            </Button>
          </>
        )}
      </Stack>
    </Box>
  )
}

export function AppNavigation({
  mobile_open,
  on_mobile_close,
}: AppNavigationProps) {
  return (
    <Box
      component="nav"
      sx={{ width: { md: navigation_width }, flexShrink: { md: 0 } }}
      aria-label="Điều hướng chính"
    >
      <Drawer
        variant="temporary"
        open={mobile_open}
        onClose={on_mobile_close}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: navigation_width,
            bgcolor: 'background.paper',
            borderRightColor: 'divider',
          },
        }}
      >
        <NavigationContent />
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: navigation_width,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRightColor: 'divider',
          },
        }}
      >
        <NavigationContent />
      </Drawer>
    </Box>
  )
}
