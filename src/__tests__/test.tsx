import React, { act } from 'react';
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

test("ローディング画面が正しく表示される", async () => {
    render(<App />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
}); 

test("テーブルをみることができる(リスト)", async () => {
    render(<App />);
    const table = await screen.findByRole('table');
    expect(table).toBeInTheDocument();
}); 

test("新規登録ボタンが存在することを確認", async () => {
    render(<App />);
    const registerButton = await screen.findByText('新規登録');
    expect(registerButton).toBeInTheDocument();
}); 

test("タイトルがあること", async () => {
    render(<App />);
    const registerButton = await screen.findByText('学習記録');
    expect(registerButton).toBeInTheDocument();
}); 

test("モーダルが新規登録というタイトルになっている", async () => {
    render(<App />);
    const registerButton = await screen.findByText('新規登録');
    act(() => {
        registerButton.click();
    });
    const modalHeader = screen.getByRole('modalHeader');
    expect(modalHeader).toHaveTextContent('新規登録');
}); 

test("学習内容がないときに登録するとエラーがでる", async () => {
    render(<App />);
    const registerButton = await screen.findByText('新規登録');
    act(() => {
        registerButton.click();
    });
    
    const submitButton = screen.getByRole('button', { name: '登録' });
    act(() => {
        submitButton.click();
    });
    
    const errorMessage = await screen.findByText('内容の入力は必須です');
    expect(errorMessage).toBeInTheDocument();
}); 

test("学習時間がないときに登録するとエラーがでる", async () => {
    render(<App />);
    const registerButton = await screen.findByText('新規登録');
    act(() => {
        registerButton.click();
    });
    
    const titleInput = screen.getByPlaceholderText('タイトル');
    fireEvent.change(titleInput, { target: { value: 'テストタイトル' } });
    
    const submitButton = screen.getByRole('button', { name: '登録' });
    act(() => {
        submitButton.click();
    });
    
    const errorMessage = await screen.findByText('時間の入力は必須です');
    expect(errorMessage).toBeInTheDocument();
}); 

test("学習時間が0以下のときに登録するとエラーがでる", async () => {
    render(<App />);
    const registerButton = await screen.findByText('新規登録');
    act(() => {
        registerButton.click();
    });
    
    const titleInput = screen.getByPlaceholderText('タイトル');
    const timeInput = screen.getByRole('spinbutton');
    
    fireEvent.change(titleInput, { target: { value: 'テストタイトル' } });
    fireEvent.change(timeInput, { target: { value: '-1' } });
    
    const submitButton = screen.getByRole('button', { name: '登録' });
    act(() => {
        submitButton.click();
    });
    
    const errorMessage = await screen.findByText('時間は0以上である必要があります');
    expect(errorMessage).toBeInTheDocument();
}); 

test("登録・削除ができること", async () => {
    render(<App />);
    await screen.findByText('学習記録');
    
    const registerButton = await screen.findByText('新規登録');
    act(() => {
        registerButton.click();
    });

    const titleInput = screen.getByPlaceholderText('タイトル');
    const timeInput = screen.getByRole('spinbutton');
    
    fireEvent.change(titleInput, { target: { value: 'テニークなテストタイトル' } });
    fireEvent.change(timeInput, { target: { value: '1' } });
    
    const submitButton = screen.getByRole('button', { name: '登録' });
    await act(async () => {
        submitButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
    });

    const records = await screen.findAllByText('テニークなテストタイトル');
    expect(records.length).toBeGreaterThan(0);
    
    const recordElement = records[0].closest('.record-label');
    const deleteButton = recordElement?.querySelector('.delete-button') as HTMLElement;
    
    await act(async () => {
        deleteButton?.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
    });
    
    expect(screen.queryByText('テニークなテストタイトル')).not.toBeInTheDocument();
}); 

test("登録内容が更新できること", async () => {
    render(<App />);
    await screen.findByText('学習記録');
    
    // 編集前のデータを作成
    const registerButton = await screen.findByText('新規登録');
    act(() => {
        registerButton.click();
    });

    const titleInput = screen.getByPlaceholderText('タイトル');
    const timeInput = screen.getByRole('spinbutton');
    
    fireEvent.change(titleInput, { target: { value: '更新前のタイトル' } });
    fireEvent.change(timeInput, { target: { value: '1' } });
    
    const submitButton = screen.getByRole('button', { name: '登録' });
    await act(async () => {
        submitButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
    });

    // 編集ボタンをクリック
    const records = await screen.findAllByText('更新前のタイトル');
    const recordElement = records[0].closest('.record-label');
    if (!recordElement) throw new Error('Record element not found');
    const editButton = recordElement.querySelector('button:not(.delete-button)') as HTMLElement;
    if (!editButton) throw new Error('Edit button not found');
    
    await act(async () => {
        editButton.click();
        await new Promise(resolve => setTimeout(resolve, 500)); // モーダルの表示を待つ時間を増やす
    });

    // 更新内容の入力
    const updateTitleInput = screen.getByTestId('title');
    const updateTimeInput = screen.getByTestId('time');
    
    fireEvent.change(updateTitleInput, { target: { value: '更新後のタイトル' } });
    fireEvent.change(updateTimeInput, { target: { value: '2' } });
    
    const updateButton = screen.getByRole('button', { name: '更新' });
    await act(async () => {
        updateButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000)); // 更新処理の待機時間を増やす
    });
    
    // 更新後の内容を確認（findByTextを使用して要素が表示されるまで待つ）
    const updatedElement = await screen.findByText('更新後のタイトル', {}, { timeout: 3000 });
    expect(updatedElement).toBeInTheDocument();
    expect(screen.queryByText('更新前のタイトル')).not.toBeInTheDocument();
}, 10000); // タイムアウトを10秒に設定

test("モーダルが記録編集というタイトルになっている", async () => {
    render(<App />);
    await screen.findByText('学習記録');
    
    // テストデータの作成
    const registerButton = await screen.findByText('新規登録');
    act(() => {
        registerButton.click();
    });

    const titleInput = screen.getByPlaceholderText('タイトル');
    const timeInput = screen.getByRole('spinbutton');
    
    fireEvent.change(titleInput, { target: { value: 'テスト用タイトル' } });
    fireEvent.change(timeInput, { target: { value: '1' } });
    
    const submitButton = screen.getByRole('button', { name: '登録' });
    await act(async () => {
        submitButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
    });

    // 編集ボタンをクリック
    const records = await screen.findAllByText('テスト用タイトル');
    const recordElement = records[0].closest('.record-label');
    if (!recordElement) throw new Error('Record element not found');
    const editButton = recordElement.querySelector('button:not(.delete-button)') as HTMLElement;
    if (!editButton) throw new Error('Edit button not found');
    
    await act(async () => {
        editButton.click();
        await new Promise(resolve => setTimeout(resolve, 500));
    });

    const modalHeader = screen.getByRole('modalHeader');
    expect(modalHeader).toHaveTextContent('記録編集');
}, 10000); // タイムアウトを10秒に設定