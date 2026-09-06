import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BugPage } from './BugPage'
import { useBugs } from '../hooks/useBugs'
import { useBug } from '../hooks/useBug'
import { createBug, updateBug, deleteBug } from '../api/bugApiClient'
import { useTasks } from '../../task/hooks/useTasks'
import type { Bug } from '../types'

jest.mock('../hooks/useBugs')
jest.mock('../hooks/useBug')
jest.mock('../api/bugApiClient')
jest.mock('../../task/hooks/useTasks')

const mockUseBugs = useBugs as jest.MockedFunction<typeof useBugs>
const mockUseBug = useBug as jest.MockedFunction<typeof useBug>
const mockCreateBug = createBug as jest.MockedFunction<typeof createBug>
const mockUpdateBug = updateBug as jest.MockedFunction<typeof updateBug>
const mockDeleteBug = deleteBug as jest.MockedFunction<typeof deleteBug>
const mockUseTasks = useTasks as jest.MockedFunction<typeof useTasks>

const bug: Bug = {
  id: 1,
  related_task_id: null,
  title: 'バグ1',
  description: null,
  severity: 'medium',
  status: 'open',
  discovered_at: '2026-09-06',
  resolved_at: null,
  created_at: '2026-09-06T04:00:00Z',
  updated_at: '2026-09-06T04:00:00Z',
}

describe('BugPage', () => {
  const refetchBugs = jest.fn()
  const refetchBug = jest.fn()

  beforeEach(() => {
    mockUseTasks.mockReturnValue({ data: [], error: null, isLoading: false, refetch: jest.fn() })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('一覧が読み込み中の場合は読み込み中メッセージを表示する', () => {
    // Arrange
    mockUseBugs.mockReturnValue({ data: null, error: null, isLoading: true, refetch: refetchBugs })
    mockUseBug.mockReturnValue({ data: null, error: null, isLoading: false, refetch: refetchBug })

    // Act
    render(<BugPage />)

    // Assert
    expect(screen.getByText('読み込み中...')).toBeInTheDocument()
  })

  it('新規作成ボタンから作成フォームを送信するとcreateBugが呼ばれ、一覧がrefetchされる', async () => {
    // Arrange
    mockUseBugs.mockReturnValue({
      data: [bug],
      error: null,
      isLoading: false,
      refetch: refetchBugs,
    })
    mockUseBug.mockReturnValue({ data: null, error: null, isLoading: false, refetch: refetchBug })
    mockCreateBug.mockResolvedValue({ ...bug, id: 2, title: '新しいバグ' })
    render(<BugPage />)

    // Act
    fireEvent.click(screen.getByRole('button', { name: '新規作成' }))
    fireEvent.change(screen.getByLabelText('タイトル'), { target: { value: '新しいバグ' } })
    fireEvent.change(screen.getByLabelText('発見日'), { target: { value: '2026-09-06' } })
    fireEvent.click(screen.getByRole('button', { name: '作成' }))

    // Assert
    await waitFor(() => {
      expect(mockCreateBug).toHaveBeenCalled()
    })
    expect(refetchBugs).toHaveBeenCalled()
  })

  it('詳細表示中に編集して送信するとupdateBugが呼ばれ、一覧・詳細がrefetchされる', async () => {
    // Arrange
    mockUseBugs.mockReturnValue({
      data: [bug],
      error: null,
      isLoading: false,
      refetch: refetchBugs,
    })
    mockUseBug.mockReturnValue({ data: bug, error: null, isLoading: false, refetch: refetchBug })
    mockUpdateBug.mockResolvedValue({ ...bug, status: 'resolved' })
    render(<BugPage />)

    // Act
    fireEvent.click(screen.getByRole('button', { name: /バグ1/ }))
    fireEvent.click(screen.getByRole('button', { name: '編集' }))
    fireEvent.change(screen.getByLabelText('ステータス'), { target: { value: 'resolved' } })
    fireEvent.change(screen.getByLabelText('解決日'), { target: { value: '2026-09-07' } })
    fireEvent.click(screen.getByRole('button', { name: '更新' }))

    // Assert
    await waitFor(() => {
      expect(mockUpdateBug).toHaveBeenCalledWith(1, expect.any(Object))
    })
    expect(refetchBugs).toHaveBeenCalled()
    expect(refetchBug).toHaveBeenCalled()
  })

  it('削除ボタンを押すとdeleteBugが呼ばれ、選択が解除され一覧がrefetchされる', async () => {
    // Arrange
    mockUseBugs.mockReturnValue({
      data: [bug],
      error: null,
      isLoading: false,
      refetch: refetchBugs,
    })
    mockUseBug.mockReturnValue({ data: bug, error: null, isLoading: false, refetch: refetchBug })
    mockDeleteBug.mockResolvedValue(undefined)
    render(<BugPage />)

    // Act
    fireEvent.click(screen.getByRole('button', { name: /バグ1/ }))
    fireEvent.click(screen.getByRole('button', { name: '削除' }))

    // Assert
    await waitFor(() => {
      expect(mockDeleteBug).toHaveBeenCalledWith(1)
    })
    expect(refetchBugs).toHaveBeenCalled()
  })

  it('削除に失敗した場合、詳細表示(viewモード)にErrorMessageを表示する(/code-review指摘)', async () => {
    // Arrange
    mockUseBugs.mockReturnValue({
      data: [bug],
      error: null,
      isLoading: false,
      refetch: refetchBugs,
    })
    mockUseBug.mockReturnValue({ data: bug, error: null, isLoading: false, refetch: refetchBug })
    mockDeleteBug.mockRejectedValue(new Error('削除に失敗しました(サーバーエラー)'))
    render(<BugPage />)

    // Act
    fireEvent.click(screen.getByRole('button', { name: /バグ1/ }))
    fireEvent.click(screen.getByRole('button', { name: '削除' }))

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('削除に失敗しました(サーバーエラー)')
    })
  })

  it('作成中に別バグを選択すると、作成フォームを閉じて詳細を表示する(/code-review指摘)', () => {
    // Arrange
    mockUseBugs.mockReturnValue({
      data: [bug],
      error: null,
      isLoading: false,
      refetch: refetchBugs,
    })
    mockUseBug.mockReturnValue({ data: bug, error: null, isLoading: false, refetch: refetchBug })
    render(<BugPage />)
    fireEvent.click(screen.getByRole('button', { name: '新規作成' }))
    expect(screen.getByLabelText('タイトル')).toBeInTheDocument()

    // Act
    fireEvent.click(screen.getByRole('button', { name: /バグ1/ }))

    // Assert
    expect(screen.queryByLabelText('タイトル')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'バグ1' })).toBeInTheDocument()
  })

  it('編集中に新規作成をキャンセルしても、編集フォームが再表示されない(/code-review指摘)', () => {
    // Arrange
    mockUseBugs.mockReturnValue({
      data: [bug],
      error: null,
      isLoading: false,
      refetch: refetchBugs,
    })
    mockUseBug.mockReturnValue({ data: bug, error: null, isLoading: false, refetch: refetchBug })
    render(<BugPage />)
    fireEvent.click(screen.getByRole('button', { name: /バグ1/ }))
    fireEvent.click(screen.getByRole('button', { name: '編集' }))
    expect(screen.getByRole('button', { name: '更新' })).toBeInTheDocument()

    // Act
    fireEvent.click(screen.getByRole('button', { name: '新規作成' }))
    fireEvent.click(screen.getByRole('button', { name: 'キャンセル' }))

    // Assert
    expect(screen.queryByRole('button', { name: '更新' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '編集' })).toBeInTheDocument()
  })

  it('バグ切替時に詳細取得中の場合は読み込み中と表示し、前のバグの詳細を残さない(/code-review指摘)', () => {
    // Arrange
    mockUseBugs.mockReturnValue({
      data: [bug],
      error: null,
      isLoading: false,
      refetch: refetchBugs,
    })
    mockUseBug.mockReturnValue({ data: null, error: null, isLoading: true, refetch: refetchBug })

    // Act
    render(<BugPage />)

    // Assert
    expect(screen.getByText('詳細を読み込み中...')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'バグ1' })).not.toBeInTheDocument()
  })
})
