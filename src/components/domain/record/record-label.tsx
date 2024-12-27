import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { deleteRecord, Record } from '../../../infrastructures/repo';

export const RecordLabel = ({ record, onDelete, onEdit }: { record: Record; onDelete: (id: string) => void; onEdit: (record: Record) => void }) => {

  const handleDelete = async () => {
    await deleteRecord(record.id);
    onDelete(record.id);  // 親コンポーネントに削除を通知
  };

  return (
    <>
        <Box className="record-label" style={{ backgroundColor: 'lightgreen', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', width: '500px' }}>
            <Text style={{ fontSize: '16px', fontWeight: 'bold', padding: "10px", width: '200px' }}>{record.title}</Text>
            <Text style={{ fontSize: '16px', fontWeight: 'bold', padding: "10px", width: '100px' }}>{record.time}時間</Text>
            <Button onClick={() => onEdit(record)} style={{ marginLeft: 'auto' }}>編集</Button>
            <Button className='delete-button' onClick={handleDelete} style={{ marginLeft: '10px' }}>削除</Button>
        </Box>
    </>
  );
};