import React, { useEffect, useState } from 'react';
import { RecordLabel } from './components/domain/record/record-label';
import { Record, findAll, save } from './infrastructures/repo';
import { Input, Text, Spinner, Center, Button } from '@chakra-ui/react';
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog"

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function App() {
  const [records, setRecords] = useState<Record[]>([]);
  const [title, setTitle] = useState<string>("");
  const [time, setTime] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  

  const handleSave = async () => {
    if(title == ""){
      alert("内容の入力は必須です")
      return;
    }
    else if(Number.isNaN(time) || time == null || time == undefined){
      alert("時間の入力は必須です")
      return;
    }
    else if(time < 0){
      alert("時間は0以上である必要があります")
      return;
    }

    await save({ id: "", title: title, time: time });
    setLoading(true);
    await sleep(1000);
    const newRecords = await findAll();
    setRecords(newRecords);
    setLoading(false);
    setTitle("");
    setTime(0);
    setOpen(false);
  };

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
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', marginTop: '20px' }}>学習記録</h1>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            {records.map((record) => (
                <RecordLabel key={record.id} record={record} onDelete={handleDelete} />
            ))}
        </div>

        <br />

        <Text style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', paddingRight: '15px' }}>合計学習時間：{allTime()}/1000(h)</Text>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <DialogRoot open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              <Button>記録追加</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>登録フォーム</DialogTitle>
              </DialogHeader>
              <DialogBody>
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
              </DialogBody>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>キャンセル</Button>
                <Button onClick={handleSave}>登録</Button>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
        </div>

    </>
  );
}

export default App;