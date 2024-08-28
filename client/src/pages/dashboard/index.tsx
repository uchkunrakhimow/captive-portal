import { Layout, LayoutBody } from '@/components/custom/layout'
import FileUpload from './fileupload'

export default function Dashboard() {
  return (
    <Layout>
      <LayoutBody className='space-y-4'>
        <FileUpload />
      </LayoutBody>
    </Layout>
  )
}
