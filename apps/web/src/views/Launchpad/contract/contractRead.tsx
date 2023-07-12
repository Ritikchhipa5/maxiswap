import { useState, useEffect } from 'react'
import { useContractRead } from 'wagmi'
import { FC_ABI, PRESALE_ABI } from './abi'
import { FC_ADDRESS } from './address'

function useContractReading() {
  const [deployedContracts, setDeployedContracts] = useState([])
  const [tokenomics, setTokenomics] = useState(null)
  const [tokenomics256, setTokenomics256] = useState(null)

  const { data: getDeployedContracts }: any = useContractRead({
    addressOrName: FC_ADDRESS,
    contractInterface: FC_ABI,
    functionName: 'getDeployedContracts',
  })

  useEffect(() => {
    if (getDeployedContracts) {
      setDeployedContracts(getDeployedContracts)
    }
  }, [getDeployedContracts])

  return {
    deployedContracts,
    tokenomics,
    tokenomics256,
  }
}

function useGetTokenomics(address) {
  const { data } = useContractRead({
    addressOrName: address,
    contractInterface: PRESALE_ABI,
    functionName: 'getTokenomics',
  })

  return data
}

function useGetTokenomics256(address) {
  const { data } = useContractRead({
    addressOrName: address,
    contractInterface: PRESALE_ABI,
    functionName: 'getTokenomics256',
  })

  return data
}

export { useContractReading, useGetTokenomics, useGetTokenomics256 }
