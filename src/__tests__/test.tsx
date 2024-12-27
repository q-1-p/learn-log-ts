import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test("新規登録ボタンが存在することを確認", () => {
    render(<App />);
    const registerButton = screen.getByText('記録追加');
    expect(registerButton).toBeInTheDocument();
}); 