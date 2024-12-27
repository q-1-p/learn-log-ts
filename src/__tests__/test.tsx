import React from 'react';
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import App from '../App';

test("新規登録ボタンが存在することを確認", async () => {
    render(<App />);
    const registerButton = await screen.findByText('新規登録');
    expect(registerButton).toBeInTheDocument();
}); 