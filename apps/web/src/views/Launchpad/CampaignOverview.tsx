import { Button, Flex, Heading, Link, Table, Td, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { PropsWithChildren, useMemo, useCallback, useEffect, useState } from 'react'
import { FetchStatus } from 'config/constants/types'
import { BigNumber, utils } from 'ethers'
import styled from 'styled-components'
import { useActiveChain } from 'hooks/useActiveChain'
import { useToken } from 'hooks/Tokens'
import { formatAmount } from 'views/Bridge/formatter'
import { useAccount } from 'wagmi'
import AppWrapper from 'components/AppWrapper'
import { useCampaigns, useFlags } from './hooks'
import TokenName from 'views/Locks/components/TokenName'
import { renderDate } from 'utils/renderDate'
import InfoTooltip from '@pancakeswap/uikit/src/components/Timeline/InfoTooltip'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { formatEther } from '@ethersproject/units'
import { useGetTokenName, useGetTokenomics, useGetTokenomics256 } from './contract/contractRead'

const RowStyled = styled.tr`
  &:hover {
    background: ${({ theme }) => theme.colors.backgroundDisabled};
  }

  &:last-of-type {
    border-radius: 0 0 16px 16px;
  }

  max-width: calc(100vw - 48px);

  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: table-row;
  }
`

const StyledFlex = styled(Flex)`
  align-items: center;
  gap: 0.25em;
`

const Td1: React.FC<PropsWithChildren> = ({ children }) => {
  const { isMobile } = useMatchBreakpoints()
  return (
    <Td
      style={{
        paddingBottom: isMobile ? '0px' : undefined,
        borderBottom: isMobile ? '0px' : undefined,
      }}
    >
      {children}
    </Td>
  )
}

const Td2: React.FC<PropsWithChildren> = ({ children }) => {
  const { isMobile } = useMatchBreakpoints()
  return <Td style={{ paddingTop: isMobile ? '12px' : undefined, wordWrap: 'break-word' }}>{children}</Td>
}

export const CampaignOverview: React.FC<{ id: any }> = ({ id }) => {
  const { isMobile } = useMatchBreakpoints()
  const [ICOData, setICOData] = useState<any>(null)
  const tokenomicsData = useGetTokenomics(id)
  const tokenomics256Data = useGetTokenomics256(id)
  const tokenName = useGetTokenName('0x416b3e951bA5ED3Dd2E8210D900370Fa1995BE00')

  useEffect(() => {
    if (tokenomicsData && tokenomics256Data) {
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
        name: tokenName,
        _tokenContractAddress: tokenomicsData._tokenContractAddress,
        // ...token,
      }
      setICOData(DATA)
      console.log(DATA, ICOData)
    }
  }, [tokenomicsData, tokenomics256Data, tokenName])

  const status = 'Fetching'
  const data = [
    {
      tokenAddress: '',
      raisedToken: '',
      isLive: '',
      softCap: '10000000000000000',
      hardCap: '10000000000000000',
      start_date: 100000000,
      end_date: 100000000000,
      rate: '10000000000000000',
      min_allowed: '0',
      max_allowed: '10000000000000000',
      pool_rate: '10000000',
      lock_duration: '10000000000000000',
      liquidity_rate: 10000,
      collected: '',
      progress: Number(10) / Number(20),
      hardCapProgress: Number(30) / Number(40),
    },
  ]
  const campaign = data?.[0]
  const chain = useActiveChain()
  const native = useToken(campaign?.raisedToken)
  const getAddressUrl = (add: string) => `${chain?.blockExplorers.default.url}/address/${add}`
  const flags = useFlags()
  useEffect(() => {
    // if (!campaign) return
    // console.log(
    //   'Total Contributed: ',
    //   utils.formatEther(campaign?.softCap.mul(Math.floor(campaign.progress * 10000)).div(10000)),
    // )
  }, [campaign?.progress, campaign?.softCap])

  const token = useToken(campaign?.tokenAddress)
  const isIceSale = flags.data?.iceSaleAddress === campaign?.tokenAddress
  if (!campaign) return null

  return (
    <AppWrapper
      hasBackButton
      title={`Viewing ${
        campaign.tokenAddress === '0xc0E49f8C615d3d4c245970F6Dc528E4A47d69a44' ? 'IceCream' : token?.name
      } Campaign`}
      subtitle=""
      backlink="/launchpad"
    >
      <Flex flexDirection="column" gap="0.75em">
        {status === FetchStatus.Failed ? (
          <Heading as="h2" marginY="3">
            Campaign not found
          </Heading>
        ) : (
          <>
            <Heading as="h2" marginY="3">
              {campaign.tokenAddress === '0xc0E49f8C615d3d4c245970F6Dc528E4A47d69a44' ? 'IceCream' : token?.name}{' '}
              Campaign
            </Heading>
            <Text>{campaign?.description}</Text>
            {campaign && (
              <>
                <Table>
                  <tbody>
                    <RowStyled>
                      <Td1>Token{isMobile && ':'}</Td1>
                      <Td2>
                        {/* <TokenName withSymbol address={campaign.tokenAddress} /> */}
                        {ICOData?.name}
                      </Td2>
                    </RowStyled>
                    <RowStyled>
                      <Td1>Token Address{isMobile && ':'}</Td1>
                      <Td2>
                        <Link external href={getAddressUrl(campaign.tokenAddress)} display="inline" target="_blank">
                          {ICOData?._tokenContractAddress}
                        </Link>
                      </Td2>
                    </RowStyled>

                    <RowStyled>
                      <Td1>
                        <StyledFlex>
                          Soft Cap{' '}
                          <InfoTooltip text="The soft cap is required for the campaign to succeed. If the Soft Cap is not reached you will get your funds back" />
                        </StyledFlex>
                      </Td1>
                      <Td2>
                        {/* {formatAmount(utils.formatUnits(campaign.softCap, 18))} {native?.symbol} */}
                        {ICOData?.softCap} MAXL
                      </Td2>
                    </RowStyled>
                    {!isIceSale ? (
                      <RowStyled>
                        <Td1>
                          <StyledFlex>
                            Hard Cap
                            <InfoTooltip text="The hard cap allows for additional contribution to the campaign. The remaining tokens of the hard cap will be burned. When the hard cap is reached the campaign is lock for additional contributions." />
                          </StyledFlex>
                        </Td1>
                        <Td2>
                          {/* {formatAmount(utils.formatUnits(campaign.hardCap, 18))} {native?.symbol} */}
                          {ICOData?.hardCap} MAXL
                        </Td2>
                      </RowStyled>
                    ) : undefined}

                    <RowStyled>
                      <Td1>Vesting</Td1>
                      <Td2>
                        {ICOData?.vestingCyclePer}% over {ICOData?.vestingCycleTimeInterval / 60} minitue
                      </Td2>
                    </RowStyled>
                    {isIceSale ? (
                      <>
                        <RowStyled>
                          <Td1>Reward</Td1>
                          <Td2>{flags.data?.reward}</Td2>
                        </RowStyled>
                        <RowStyled>
                          <Td1>Vesting Duration</Td1>
                          <Td2>{flags.data?.vestingDuration}</Td2>
                        </RowStyled>
                      </>
                    ) : (
                      <>
                        <RowStyled>
                          <Td1>
                            <StyledFlex>
                              Raised Fund
                              <InfoTooltip text="That percentage of the total raised amount that will be added as liquidity." />
                            </StyledFlex>
                          </Td1>
                          <Td2>{ICOData?.raisedFund}</Td2>
                        </RowStyled>
                      </>
                    )}
                    <RowStyled>
                      <Td1>Starting at</Td1>
                      <Td2>{renderDate(ICOData?.startTime ? ICOData?.startTime * 1000 : 0)}</Td2>
                    </RowStyled>
                    <RowStyled>
                      <Td1>Ending at</Td1>
                      <Td2>{renderDate(ICOData?.endTime ? ICOData?.endTime * 1000 : 0)}</Td2>
                    </RowStyled>
                  </tbody>
                </Table>
              </>
            )}
          </>
        )}
      </Flex>
    </AppWrapper>
  )
}
