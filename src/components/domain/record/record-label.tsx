import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { deleteRecord, Record } from '../../../infrastructures/repo';

export const RecordLabel = ({ record, onDelete }: { record: Record; onDelete: (id: string) => void }) => {

  const handleDelete = async () => {
    await deleteRecord(record.id);
    onDelete(record.id);  // 親コンポーネントに削除を通知
  };

  return (
    <>
        <Box style={{ backgroundColor: 'lightgreen', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', width: '500px' }}>
            <Text style={{ fontSize: '16px', fontWeight: 'bold', padding: "10px", width: '200px' }}>{record.title}</Text>
            <Text style={{ fontSize: '16px', fontWeight: 'bold', padding: "10px", width: '100px' }}>{record.time}時間</Text>
            <Button onClick={handleDelete} style={{ marginLeft: 'auto' }}>削除</Button>
        </Box>
    </>
  );
};