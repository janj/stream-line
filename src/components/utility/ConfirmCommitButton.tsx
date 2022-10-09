import { useState } from 'react';
import { Box, Button } from '@material-ui/core'
import { ButtonProps } from '@material-ui/core/Button/Button'

export function ConfirmCommitButton({
                                      onClick,
                                      children,
                                      ...props
                                    }: ButtonProps) {
  const [confirming, setConfirming] = useState(false)

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
