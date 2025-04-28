/* eslint-disable react/prop-types */
import { Switch } from '@headlessui/react'

function SwitchToggle({ onChange, isLogin }) {
  return (
    <Switch
      checked={isLogin}
      onChange={onChange}
      className={`bg-blue-600 relative inline-flex h-6 w-11 items-center rounded-full`}
    >
      <span
        className={`${
          isLogin ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch>
  )
}

export default SwitchToggle;