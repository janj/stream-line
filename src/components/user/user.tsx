import { Box } from '@material-ui/core'

export function User({ user }: {user: Parse.Object}) {
  return <Box>
    <Box>{`User: ${user.get('username')}`}</Box>
  </Box>
}