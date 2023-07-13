import { useState, useEffect } from 'react'
import { erc20ABI, readContracts, useContractRead, useContractReads } from 'wagmi'
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
  let { data } = useContractRead({
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
function useGetTokenName(address) {
  const { data } = useContractRead({
    addressOrName: address,
    contractInterface: erc20ABI,
    functionName: 'name',
  })

  // const { data } = readContracts({
  //   contracts: [
  //     { ...wagmigotchiContract, functionName: 'name' },
  //     { ...wagmigotchiContract, functionName: 'symbol' },
  //   ],
  // })
  console.log(data)

  return data
}

export { useContractReading, useGetTokenomics, useGetTokenomics256, useGetTokenName }
