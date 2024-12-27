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

test("学���時間がないときに登録するとエラーがでる", async () => {
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
    expect(records).toHaveLength(1);
    
    const recordElement = records[0].closest('.record-label');
    const deleteButton = recordElement?.querySelector('button');
    expect(deleteButton).not.toBeNull();
    
    await act(async () => {
        deleteButton?.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
    });
    
    expect(screen.queryByText('テニークなテストタイトル')).not.toBeInTheDocument();
}); 