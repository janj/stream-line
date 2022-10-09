import { useState } from 'react';
import { ConfirmCommitButton } from './ConfirmCommitButton'
import { ButtonProps } from '@material-ui/core/Button/Button'

interface IProps extends ButtonProps {
  onClick: () => Promise<unknown>
  stayDisabled?: boolean
}

export default function AutoDisableButton({
  onClick,
  stayDisabled,
  children,
  ...props
}: IProps) {
  const [disabled, setDisabled] = useState(false)
  const onDisableClick = () => {
    setDisabled(true)
    onClick().then(() => setDisabled(stayDisabled || false))
  }
  return <ConfirmCommitButton disabled={disabled} onClick={onDisableClick} {...props}>{children}</ConfirmCommitButton>
}
