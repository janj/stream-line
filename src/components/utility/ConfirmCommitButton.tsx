import * as React from 'react'
import { Box, Button } from '@material-ui/core'

export function ConfirmCommitButton({
                                      onClick,
                                      children,
                                      ...props
                                    }: any) {
  const [confirming, setConfirming] = React.useState(false)

  const onConfirm = (e: any) => {
    setConfirming(false)
    onClick && onClick(e)
  }

  if (confirming) {
    return (
      <Box component={'span'} padding={'5px'} border={'solid 1px'}>
        <Button onClick={onConfirm}>Confirm</Button>
        <Button onClick={() => setConfirming(false)}>Cancel</Button>
      </Box>
    )
  }
  return (
    <Button onClick={() => setConfirming(true)} {...props}>
      {children}
    </Button>
  )
}
