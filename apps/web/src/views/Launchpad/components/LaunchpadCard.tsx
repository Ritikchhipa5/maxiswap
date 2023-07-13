import { Box, Button, Card, Flex, Progress, Text } from '@pancakeswap/uikit'
import styled, { useTheme } from 'styled-components'
import CampaignCardHeader from './CampaignCardHeader'
import { renderDate } from 'utils/renderDate'
import { useContractReading, useGetTokenomics, useGetTokenomics256 } from '../contract/contractRead'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { formatEther } from '@ethersproject/units'
// import moment from 'moment'

function LaunchpadCard() {
  const { colors } = useTheme()
  const [ICOData, setICOData] = useState<any>(null)
  const StyledCard = styled(Card)`
    align-self: baseline;
    max-width: 100%;
    margin: 0 0 24px 0;
    ${({ theme }) => theme.mediaQueries.sm} {
      max-width: 350px;
      margin: 0 12px 46px;
    }
  `

  const LaunchpadCardInnerContainer = styled(Flex)`
    flex-direction: column;
    justify-content: space-around;
    padding: 24px;
    gap: 0.75em;
  `

  const ExpandingWrapper = styled(Flex)`
    padding: 24px;
    border-top: 2px solid ${({ theme }) => theme.colors.cardBorder};
    overflow: hidden;
    justify-content: center;
  `
  const campaign = {
    id: '1',
    address: '0xc0E49f8C615d3d4c245970F6Dc528E4A47d69a44',
    tags: ['Kyc', 'Official'],
  }
  const roundString = (str: string) => {
    const [whole, decimal] = str.split('.')
    if (!decimal) return whole
    return `${whole}.${decimal.slice(0, 2)}`
  }

  const { deployedContracts } = useContractReading()

  const tokenomicsData = useGetTokenomics(deployedContracts[deployedContracts.length - 1])
  const tokenomics256Data = useGetTokenomics256(deployedContracts[deployedContracts.length - 1])

  useEffect(() => {
    if (tokenomicsData && tokenomics256Data) {
      console.log(tokenomics256Data, tokenomicsData)
      // const token = await fetchToken({
      //   address: tokenomicsData._tokenContractAddress,
      // })
      // console.log(tokenomicsData)
      const DATA = {
        _isSaleFinalize: tokenomicsData?._isSaleFinalize,
        startTime: parseInt(tokenomics256Data[0]),
        endTime: parseInt(tokenomics256Data[1]),
        raisedFund: formatEther(tokenomics256Data[2]),
        softCap: formatEther(tokenomics256Data[3]),
        hardCap: formatEther(tokenomics256Data[4]),
        isSaleFinalize: tokenomicsData[3],
        tokenDecimal: parseInt(tokenomicsData[4]),
        vestingCyclePer: parseInt(tokenomicsData[2]),
        vestingCycleTimeInterval: parseInt(tokenomicsData[1]),
        _tokenContractAddress: tokenomicsData._tokenContractAddress,
        // ...token,
      }
      setICOData(DATA)
      console.log(DATA)
    }
  }, [tokenomicsData, tokenomics256Data])

  // console.log(token)

  return (
    <div>
      <StyledCard>
        <LaunchpadCardInnerContainer>
          <CampaignCardHeader campaign={campaign} />
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="16px" color="secondary" fontWeight="bold">
              {/* {formatAmount(utils.formatUnits(campaign.rate, token?.decimals))} {token?.symbol} per ICE */}
              1000 MAXL per ICE
            </Text>
          </Flex>
          <Flex flexDirection="column" gap="0.5em">
            <Flex flexDirection="column" gap="0.5em">
              <Flex alignItems="center" gap="0.5em">
                <Box width="1ch" height="1ch" backgroundColor={colors.secondary} /> Soft Cap: {ICOData?.softCap} MAXL
              </Flex>
              <Flex alignItems="center" gap="0.5em">
                <Box width="1ch" height="1ch" backgroundColor={colors.success} /> Hard Cap: {ICOData?.hardCap} MAXL
              </Flex>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontSize="16px" fontWeight="bold">
                Progress ({roundString(`${(ICOData?.raisedFund / ICOData?.hardCap) * 100}`)}%) of hard cap
              </Text>
            </Flex>
            <Progress
              primaryStep={(ICOData?.raisedFund / ICOData?.hardCap) * 100}
              secondaryStep={(ICOData?.raisedFund / ICOData?.hardCap) * 100}
            />
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontSize="16px">Vesting Cycle </Text>
              <Text fontSize="16px">{ICOData?.vestingCyclePer}%</Text>
            </Flex>
            {true && (
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="16px">Ending at</Text>
                <Text fontSize="16px">{renderDate(ICOData?.endTime ? ICOData?.endTime * 1000 : 0 * 1000)}</Text>
              </Flex>
            )}{' '}
            <Button disabled={ICOData?.isSaleFinalize}>Claim</Button>
          </Flex>
        </LaunchpadCardInnerContainer>
        <ExpandingWrapper>
          <Link fontSize="16px" color="primary" href={`/launchpad/${deployedContracts[deployedContracts.length - 1]}`}>
            Details
          </Link>
        </ExpandingWrapper>
      </StyledCard>
    </div>
  )
}

export default LaunchpadCard
