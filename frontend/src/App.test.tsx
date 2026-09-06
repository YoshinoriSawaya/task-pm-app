import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

jest.mock('./features/task/components/TaskPage', () => ({
  TaskPage: () => <div>TaskPageの内容</div>,
}))
jest.mock('./features/bug/components/BugPage', () => ({
  BugPage: () => <div>BugPageの内容</div>,
}))
jest.mock('./features/progress/components/ProgressDashboard', () => ({
  ProgressDashboard: () => <div>ProgressDashboardの内容</div>,
}))

describe('App', () => {
  it('初期表示ではタスク画面を表示する', () => {
    // Arrange & Act
    render(<App />)

    // Assert
    expect(screen.getByText('TaskPageの内容')).toBeInTheDocument()
  })

  it('「バグ」タブを押すとバグ画面に切り替わる', () => {
    // Arrange
    render(<App />)

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'バグ' }))

    // Assert
    expect(screen.getByText('BugPageの内容')).toBeInTheDocument()
    expect(screen.queryByText('TaskPageの内容')).not.toBeInTheDocument()
  })

  it('「進捗」タブを押すと進捗ダッシュボードに切り替わる', () => {
    // Arrange
    render(<App />)

    // Act
    fireEvent.click(screen.getByRole('button', { name: '進捗' }))

    // Assert
    expect(screen.getByText('ProgressDashboardの内容')).toBeInTheDocument()
  })
})
