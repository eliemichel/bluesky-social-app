import React from 'react'
import {Pressable, StyleSheet, View} from 'react-native'
import {observer} from 'mobx-react-lite'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {useNavigation} from '@react-navigation/native'
import {usePalette} from 'lib/hooks/usePalette'
import {useWebMediaQueries} from 'lib/hooks/useWebMediaQueries'
import {Text} from '../util/text/Text'
import {TextLink} from '../util/Link'
import {UserAvatar, UserAvatarType} from '../util/UserAvatar'
import {LoadingPlaceholder} from '../util/LoadingPlaceholder'
import {CenteredView} from '../util/Views'
import {sanitizeHandle} from 'lib/strings/handles'
import {makeProfileLink} from 'lib/routes/links'
import {useStores} from 'state/index'
import {NavigationProp} from 'lib/routes/types'
import {BACK_HITSLOP} from 'lib/constants'
import {isNative} from 'platform/detection'
import {ImagesLightbox} from 'state/models/ui/shell'

export const ProfileSubpageHeader = observer(function HeaderImpl({
  isLoading,
  href,
  title,
  avatar,
  isOwner,
  creator,
  avatarType,
  children,
}: React.PropsWithChildren<{
  isLoading?: boolean
  href: string
  title: string | undefined
  avatar: string | undefined
  isOwner: boolean | undefined
  creator:
    | {
        did: string
        handle: string
      }
    | undefined
  avatarType: UserAvatarType
}>) {
  const store = useStores()
  const navigation = useNavigation<NavigationProp>()
  const {isMobile} = useWebMediaQueries()
  const pal = usePalette('default')
  const canGoBack = navigation.canGoBack()

  const onPressBack = React.useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    } else {
      navigation.navigate('Home')
    }
  }, [navigation])

  const onPressMenu = React.useCallback(() => {
    store.shell.openDrawer()
  }, [store])

  const onPressAvi = React.useCallback(() => {
    if (
      avatar // TODO && !(view.moderation.avatar.blur && view.moderation.avatar.noOverride)
    ) {
      store.shell.openLightbox(new ImagesLightbox([{uri: avatar}], 0))
    }
  }, [store, avatar])

  return (
    <CenteredView style={pal.view}>
      {isMobile && (
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomWidth: 1,
              paddingTop: isNative ? 0 : 8,
              paddingBottom: 8,
              paddingHorizontal: isMobile ? 12 : 14,
            },
            pal.border,
          ]}>
          <Pressable
            testID="headerDrawerBtn"
            onPress={canGoBack ? onPressBack : onPressMenu}
            hitSlop={BACK_HITSLOP}
            style={canGoBack ? styles.backBtn : styles.backBtnWide}
            accessibilityRole="button"
            accessibilityLabel={canGoBack ? 'Back' : 'Menu'}
            accessibilityHint="">
            {canGoBack ? (
              <FontAwesomeIcon
                size={18}
                icon="angle-left"
                style={[styles.backIcon, pal.text]}
              />
            ) : (
              <FontAwesomeIcon
                size={18}
                icon="bars"
                style={[styles.backIcon, pal.textLight]}
              />
            )}
          </Pressable>
          <View style={{flex: 1}} />
          {children}
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 10,
          paddingTop: 14,
          paddingBottom: 6,
          paddingHorizontal: isMobile ? 12 : 14,
        }}>
        <Pressable
          testID="headerAviButton"
          onPress={onPressAvi}
          accessibilityRole="image"
          accessibilityLabel="View the avatar"
          accessibilityHint=""
          style={{width: 58}}>
          <UserAvatar type={avatarType} size={58} avatar={avatar} />
        </Pressable>
        <View style={{flex: 1}}>
          {isLoading ? (
            <LoadingPlaceholder
              width={200}
              height={32}
              style={{marginVertical: 6}}
            />
          ) : (
            <TextLink
              testID="headerTitle"
              type="title-xl"
              href={href}
              style={[pal.text, {fontWeight: 'bold'}]}
              text={title || ''}
              onPress={() => store.emitScreenSoftReset()}
              numberOfLines={4}
            />
          )}

          {isLoading ? (
            <LoadingPlaceholder width={50} height={8} />
          ) : (
            <Text type="xl" style={[pal.textLight]} numberOfLines={1}>
              by{' '}
              {!creator ? (
                '—'
              ) : isOwner ? (
                'you'
              ) : (
                <TextLink
                  text={sanitizeHandle(creator.handle, '@')}
                  href={makeProfileLink(creator)}
                  style={pal.textLight}
                />
              )}
            </Text>
          )}
        </View>
        {!isMobile && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {children}
          </View>
        )}
      </View>
    </CenteredView>
  )
})

const styles = StyleSheet.create({
  backBtn: {
    width: 20,
    height: 30,
  },
  backBtnWide: {
    width: 20,
    height: 30,
    paddingHorizontal: 6,
  },
  backIcon: {
    marginTop: 6,
  },
})
