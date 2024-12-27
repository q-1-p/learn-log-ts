import React, { useEffect, useState } from 'react';
import { RecordLabel } from './components/domain/record/record-label';
import { Record, findAll, save, update, deleteRecord } from './infrastructures/repo';
import {
  Input,
  Text,
  Spinner,
  Center,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useForm } from "react-hook-form"

type Inputs = {
  title: string;
  time: number;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function App() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset,
    setValue
  } = useForm<Inputs>();
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);

  const onSubmit = async (data: Inputs) => {
    await save({ id: editingRecord?.id || "", title: data.title, time: data.time });
    setLoading(true);
    await sleep(1000);
    const newRecords = await findAll();
    setRecords(newRecords);
    setLoading(false);
    reset();
    setOpen(false);
    setEditingRecord(null);
  };

  const onUpdate = async (data: Inputs) => {
    if (!editingRecord) return;
    await update(editingRecord.id, data.title, data.time);
    setLoading(true);
    await sleep(1000);
    const newRecords = await findAll();
    setRecords(newRecords);
    setLoading(false);
    reset();
    setOpen(false);
    setEditingRecord(null);
  };

  const handleEdit = (record: Record) => {
    setEditingRecord(record);
    setValue("title", record.title);
    setValue("time", record.time);
    setOpen(true);
  };

  const handleOpenNew = () => {
    setEditingRecord(null);
    reset();
    setOpen(true);
  };

  const allTime = (): number => {
    return records.reduce((total, record) => total + record.time, 0);
  }

  const handleDelete = async (id: string) => {
    await deleteRecord(id);
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
        <Spinner size="xl" role="status" />
      </Center>
    );
  }

  return (
    <>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', marginTop: '20px' }}>学習記録</h1>

        <div role="table" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            {records.map((record) => (
                <RecordLabel key={record.id} record={record} onDelete={handleDelete} onEdit={handleEdit} />
            ))}
        </div>

        <br />

        <Text style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', paddingRight: '15px' }}>合計学習時間：{allTime()}/1000(h)</Text>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Button onClick={handleOpenNew}>新規登録</Button>

          <Modal isOpen={open} onClose={() => {
            setOpen(false);
            setEditingRecord(null);
            reset();
          }}>
            <ModalOverlay />
            <ModalContent maxWidth="800px" maxHeight="600px">
              <ModalHeader role="modalHeader">{editingRecord ? '記録編集' : '新規登録'}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl isInvalid={!!errors.title}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px', marginRight: '55px' }}>
                    <Text style={{ fontSize: '20px', fontWeight: 'bold', paddingRight: '15px' }}>学習記録</Text>
                    <Input
                      data-testid="title"
                      {...register("title", { 
                        required: "内容の入力は必須です"
                      })}
                      type="text"
                      style={{ width: '200px' }}
                      placeholder="タイトル"
                    />
                    <FormErrorMessage style={{ paddingLeft: '15px' }}>
                      {errors.title && errors.title.message}
                    </FormErrorMessage>
                  </div>
                </FormControl>

                <FormControl isInvalid={!!errors.time}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: '20px', fontWeight: 'bold', paddingRight: '15px' }}>学習時間</Text>
                    <Input
                      data-testid="time"
                      {...register("time", {
                        required: "時間の入力は必須です",
                        min: { value: 0, message: "時間は0以上である必要があります" },
                        valueAsNumber: true
                      })}
                      type="number"
                      style={{ width: '200px' }}
                    />
                    <Text style={{ fontSize: '20px', fontWeight: 'bold', paddingRight: '15px' }}>時間</Text>
                    <FormErrorMessage style={{ paddingLeft: '15px' }}>
                      {errors.time && errors.time.message}
                    </FormErrorMessage>
                  </div>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button variant="outline" mr={3} onClick={() => {
                  setOpen(false);
                  setEditingRecord(null);
                  reset();
                }}>キャンセル</Button>
                <Button type="submit" onClick={editingRecord ? handleSubmit(onUpdate) : handleSubmit(onSubmit)}>{editingRecord ? '更新' : '登録'}</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </form>

    </>
  );
}

export default App;