import { useState } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { toast } from '@/components/ui/use-toast';

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const fileTypes = ['image/jpeg', 'image/png', 'image/gif'];

      if (!fileTypes.includes(file.type)) {
        toast({
          variant: 'destructive',
          title: 'Произошла ошибка при загрузке файла',
          description: 'Пожалуйста, загрузите файл изображения (png, jpg, gif)',
        });
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        variant: 'destructive',
        title: 'Произошла ошибка при загрузке файла',
        description: 'Файл не выбран.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    axios
      .post('/admin/fileUpload', formData)
      .then(response => {
        localStorage.setItem(
          'logo',
          `http://localhost/uploads/${response.data}`,
        );
        setSelectedFile(null);
        toast({
          title: 'Файл успешно загружен',
        });
      })
      .catch(error => {
        console.log(error);
        toast({
          variant: 'destructive',
          title: 'Загрузка файла не удалась. Пожалуйста, попробуйте еще раз.',
        });
      });
  };

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full'>
        <h3 className='text-2xl font-semibold mb-6 text-gray-700'>
          Загрузить файл
        </h3>
        <input
          type='file'
          onChange={handleFileUpload}
          accept='image/png, image/jpeg, image/gif'
          className={classNames(
            'block w-full text-sm text-gray-500',
            'file:mr-4 file:py-2 file:px-4',
            'file:rounded-full file:border-0',
            'file:text-sm file:font-semibold',
            'file:bg-blue-50 file:text-blue-700',
            'hover:file:bg-blue-100',
            'mb-4',
          )}
        />
        <button
          onClick={handleUpload}
          className='w-full py-2 px-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200'
        >
          Загрузить
        </button>
      </div>
    </div>
  );
};

export default UploadFile;
