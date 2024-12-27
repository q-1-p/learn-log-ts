import React, { useEffect, useState } from 'react';
import { RecordLabel } from './components/domain/record/record-label';
import { Record, findAll, save } from './infrastructures/repo';
import { Input, Text, Spinner, Center, Button } from '@chakra-ui/react';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function App() {
  const [records, setRecords] = useState<Record[]>([]);
  const [title, setTitle] = useState<string>("");
  const [time, setTime] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const allTime = (): number => {
    return records.reduce((total, record) => total + record.time, 0);
  }

  const handleDelete = (id: string) => {
    setRecords(prev => prev.filter(record => record.id !== id));
  };
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await sleep(100);
      findAll()
        .then(setRecords)
        .finally(() => setLoading(false));
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <>
        <br />

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
          <Text style={{ fontSize: '20px', fontWeight: 'bold', paddingRight: '15px' }}>学習記録</Text>
          <Input type="text" style={{ width: '200px' }} placeholder="タイトル" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Text style={{ fontSize: '20px', fontWeight: 'bold', paddingRight: '15px' }}>　　</Text>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: '20px', fontWeight: 'bold', paddingRight: '15px' }}>学習時間</Text>
          <Input type="text" style={{ width: '200px' }} value={time} onChange={(e) => setTime(Number(e.target.value))} />
          <Text style={{ fontSize: '20px', fontWeight: 'bold', paddingRight: '15px' }}>時間</Text>
        </div>

        <br />

        <Text style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', paddingRight: '15px' }}>入力されている学習内容：{title}</Text>
        <Text style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', paddingRight: '15px' }}>入力されている学習時間：{time}時間</Text>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            {records.map((record) => (
                <RecordLabel key={record.id} record={record} onDelete={handleDelete} />
            ))}
        </div>

        <br />

        <Text style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', paddingRight: '15px' }}>合計学習時間：{allTime()}/1000(h)</Text>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
          <Button  onClick={async () => {
            await save({ id: "", title: title, time: time });
            setLoading(true);
            await sleep(1000);
            const newRecords = await findAll();
            setRecords(newRecords);
            setLoading(false);
            setTitle("");
            setTime(0);
          }}>登録</Button>
        </div>

    </>
  );
}

export default App;