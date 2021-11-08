import { useState, useCallback } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import { FaFileSignature } from 'react-icons/fa'
import { format } from 'date-fns'

import { toast } from 'react-toastify'
import { api } from '../service/api'

interface IFile {
  file: any
}

interface ITransactions {
  id?: string;
  transaction_type: string;
  date_occurrence: Date;
  movement_value: number;
  card: string;
  time_occurrence: Date;
  cpf: string;
  owner: string;
  store_name: string;
}


const Home: NextPage = () => {
  const [file, setFile] = useState<IFile>()
  const [data, setData] = useState<ITransactions[]>([])

  const handlerSubmit = useCallback(async () => {
    const formData = new FormData()

    formData.append('file', file?.file[0])
    formData.append('type_file', file?.file[0].type)

    try {
      const response = await api.post('transaction/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      setFile(undefined)
      setData(response.data)
      toast.success('Upload do arquivo realizado com sucesso!')
    } catch (error) {
      toast.error('Não foi possível completar a ação.')
    }
  }, [file])

  
  return (
    <div className={styles.container}>
      <Head>
        <title>Test ByCoders</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta name="theme-color" content="#fff" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to ByCoders
        </h1>
        {data?.length === 0 ? 
          <div className={styles.container}>
            <FaFileSignature color="#004642" size="80" />
            <input type="file" onChange={(e) => setFile({ file: e.target.files })} />
            <p style={{ color: 'black' }}>{file?.file[0].name}</p>
            <button onClick={handlerSubmit}>Enviar</button>
          </div> : 
          <div className={styles.container}>
            <table>
              <tr>
                  <td>Tipo</td>
                  <td>Data</td>
                  <td>Valor</td>
                  <td>CPF</td>
                  <td>Cartão</td>
                  <td>Dono da loja</td>
                  <td>Nome loja</td>
              </tr>
              {data.map(item => 
                <tr key={item.id}>
                  <td>{item.transaction_type}</td>
                  <td>{format(new Date(item.date_occurrence), 'dd/MM/yyyy')}</td>
                  <td>{item.movement_value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                  <td>{item.cpf}</td>
                  <td>{item.card}</td>
                  <td>{item.owner}</td>
                  <td>{item.store_name}</td>
                </tr>
              )}
          </table>
          </div>
        }
        
        
      </main>
    </div>
  )
}

export default Home
