import { render, screen } from '@testing-library/react'
import { ErrorMessage } from './ErrorMessage'

describe('ErrorMessage', () => {
  it('messageを表示する', () => {
    // Arrange & Act
    render(<ErrorMessage message="タスクが見つかりません" />)

    // Assert
    expect(screen.getByRole('alert')).toHaveTextContent('タスクが見つかりません')
  })
})
