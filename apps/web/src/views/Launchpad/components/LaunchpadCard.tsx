import { Box, Button, Card, Flex, Progress, Text } from '@pancakeswap/uikit'
import styled, { useTheme } from 'styled-components'
import CampaignCardHeader from './CampaignCardHeader'
import { renderDate } from 'utils/renderDate'

import Link from 'next/link'

function LaunchpadCard() {
  const { isDark, colors } = useTheme()
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

  return (
    <div>
      <StyledCard>
        <LaunchpadCardInnerContainer>
          <CampaignCardHeader campaign={campaign} />
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="16px" color="secondary" fontWeight="bold">
              {/* {formatAmount(utils.formatUnits(campaign.rate, token?.decimals))} {token?.symbol} per ICE */}
              1000 CORE per ICE
            </Text>
          </Flex>
          <Flex flexDirection="column" gap="0.5em">
            <Flex flexDirection="column" gap="0.5em">
              <Flex alignItems="center" gap="0.5em">
                <Box width="1ch" height="1ch" backgroundColor={colors.secondary} /> Soft Cap:{' '}
                {roundString(String(10 * 100))}%
              </Flex>
              <Flex alignItems="center" gap="0.5em">
                <Box width="1ch" height="1ch" backgroundColor={colors.success} /> Hard Cap:{' '}
                {roundString(String(10 * 100))}%
              </Flex>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontSize="16px" fontWeight="bold">
                Progress ({roundString(`${0.6 * 100}`)}%) of hard cap
              </Text>
            </Flex>
            <Progress primaryStep={0.5 * 100} secondaryStep={0.5 * 100} />
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontSize="16px">Listing price increase</Text>
              <Text fontSize="16px">50%</Text>
            </Flex>
            {true && (
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="16px">Ending at</Text>
                <Text fontSize="16px">{renderDate(10000000)}</Text>
              </Flex>
            )}{' '}
            <Button disabled={true}>Claim</Button>
          </Flex>
        </LaunchpadCardInnerContainer>
        <ExpandingWrapper>
          <Link fontSize="16px" color="primary" href={`/launchpad/${campaign.id}`}>
            Details
          </Link>
        </ExpandingWrapper>
      </StyledCard>
    </div>
  )
}

export default LaunchpadCard