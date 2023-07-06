import { Flex, Heading, TokenImage } from '@pancakeswap/uikit'
import { CurrencyLogo } from 'components/Logo'
import { useToken } from 'hooks/Tokens'
import styled from 'styled-components'
import { CampaignData } from '../hooks'
import { LaunchpadTags } from './Tags'

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`
interface LaunchpadCardHeaderProps {
  campaign: CampaignData
}

const Logo = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`

const CampaignCardHeader: React.FC<LaunchpadCardHeaderProps> = (props) => {
  const { campaign } = props
  const token = useToken(campaign?.tokenAddress)

  return (
    <Wrapper>
      <CurrencyLogo currency={token} size="60px" />
      <Flex flexDirection="column" alignItems="flex-end" gap="4px">
        <Heading>
          {campaign.tokenAddress === '0xc0E49f8C615d3d4c245970F6Dc528E4A47d69a44' ? 'IceCream' : token?.name}
        </Heading>
        <Flex justifyContent="center" style={{ gap: '0.5em' }}>
          {campaign.tags.map((tag) => {
            const Tag = LaunchpadTags[tag]
            return <Tag key={tag} />
          })}
        </Flex>
      </Flex>
    </Wrapper>
  )
}

export default CampaignCardHeader
