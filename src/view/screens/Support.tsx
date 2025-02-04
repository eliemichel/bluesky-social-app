import React from 'react'
import {View} from 'react-native'
import {useFocusEffect} from '@react-navigation/native'
import {NativeStackScreenProps, CommonNavigatorParams} from 'lib/routes/types'
import {ViewHeader} from '../com/util/ViewHeader'
import {useStores} from 'state/index'
import {Text} from 'view/com/util/text/Text'
import {TextLink} from 'view/com/util/Link'
import {CenteredView} from 'view/com/util/Views'
import {usePalette} from 'lib/hooks/usePalette'
import {s} from 'lib/styles'
import {HELP_DESK_URL} from 'lib/constants'

type Props = NativeStackScreenProps<CommonNavigatorParams, 'Support'>
export const SupportScreen = (_props: Props) => {
  const store = useStores()
  const pal = usePalette('default')

  useFocusEffect(
    React.useCallback(() => {
      store.shell.setMinimalShellMode(false)
    }, [store]),
  )

  return (
    <View>
      <ViewHeader title="Support" />
      <CenteredView>
        <Text type="title-xl" style={[pal.text, s.p20, s.pb5]}>
          Support
        </Text>
        <Text style={[pal.text, s.p20]}>
          The support form has been moved. If you need help, please
          <TextLink
            href={HELP_DESK_URL}
            text=" click here"
            style={pal.link}
          />{' '}
          or visit {HELP_DESK_URL} to get in touch with us.
        </Text>
      </CenteredView>
    </View>
  )
}
