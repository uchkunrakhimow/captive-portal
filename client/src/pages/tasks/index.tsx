import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, LayoutBody } from '@/components/custom/layout';

interface CsvFile {
  name: string;
  url: string;
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Tasks() {
  const [data, setData] = useState<CsvFile[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/admin/ip-list');

        if (Array.isArray(response.data)) {
          setData(response.data);
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        {data.length === 0 ? (
          <p>Нет активных данных</p>
        ) : (
          <Table className='border w-3/5'>
            <TableHeader>
              <TableRow>
                <TableHead className=''>Наименование</TableHead>
                <TableHead>Действие</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className='font-medium'>{item.name}</TableCell>
                  <TableCell>
                    <a href={'http://localhost/storage/' + item.name}>
                      Скачать
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </LayoutBody>
    </Layout>
  );
}
