import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import HeadphonesOutlinedIcon from '@mui/icons-material/HeadphonesOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'

import { useAuth } from '../../auth/hooks/useAuth'

export const navigation_width = 224

interface AppNavigationProps {
  mobile_open: boolean
  on_mobile_close: () => void
}

const navigation_items = [
  {
    label: 'Trang chủ',
    icon: <HomeOutlinedIcon />,
    active: false,
    coming_soon: false,
  },
  {
    label: '1000 từ vựng',
    icon: <AutoStoriesOutlinedIcon />,
    active: true,
    coming_soon: false,
  },
  {
    label: 'Ngữ pháp',
    icon: <MenuBookOutlinedIcon />,
    active: false,
    coming_soon: true,
  },
  {
    label: 'Luyện nghe',
    icon: <HeadphonesOutlinedIcon />,
    active: false,
    coming_soon: true,
  },
  {
    label: 'Thống kê',
    icon: <BarChartOutlinedIcon />,
    active: false,
    coming_soon: true,
  },
]

function NavigationContent() {
  const { user, logout } = useAuth()

  return (
    <Box sx={{ height: '100%', px: 2, py: 3 }}>
      <Typography
        variant="h6"
        fontWeight={800}
        sx={{ px: 1.5, mb: 3, letterSpacing: '-0.02em' }}
      >
        Study English
      </Typography>

      <List disablePadding>
        {navigation_items.map((item) => (
          <ListItemButton
            key={item.label}
            selected={item.active}
            disabled={item.coming_soon}
            sx={{
              minHeight: 44,
              borderRadius: 2,
              mb: 0.75,
              px: 1.5,
              '&.Mui-selected': {
                color: 'primary.main',
                bgcolor: '#EEEEFF',
                '&:hover': { bgcolor: '#E8E8FF' },
              },
              '&.Mui-disabled': { opacity: 0.62 },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 34,
                color: item.active ? 'primary.main' : 'text.secondary',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              slotProps={{
                primary: {
                  fontSize: 14,
                  fontWeight: item.active ? 750 : 600,
                },
              }}
            />
            {item.coming_soon && (
              <Chip
                label="Sắp có"
                size="small"
                sx={{ height: 21, fontSize: 10, fontWeight: 700 }}
              />
            )}
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ mt: 3 }} />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', px: 1.5, mt: 2 }}
      >
        Học mỗi ngày, tiến bộ mỗi ngày.
      </Typography>

      {user && (
        <Box sx={{ px: 1.5, mt: 2 }}>
          <Typography variant="body2" fontWeight={700} noWrap>
            {user.display_name || user.email}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            sx={{ display: 'block' }}
          >
            {user.email}
          </Typography>
          <Button
            size="small"
            startIcon={<LogoutOutlinedIcon />}
            onClick={() => void logout()}
            sx={{ mt: 1, px: 0 }}
          >
            Đăng xuất
          </Button>
        </Box>
      )}
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
            borderRightColor: 'divider',
          },
        }}
      >
        <NavigationContent />
      </Drawer>
    </Box>
  )
}
