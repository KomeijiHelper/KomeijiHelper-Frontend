<template>
    <template v-if="avatarName">
        <VaDropdown stick-to-edges class="profile-dropdown">
            <template #anchor>
                <VaButton text-color="textHeader">
                    <VaAvatar font-size="18px">
                        <slot>{{ avatarName }}</slot>
                    </VaAvatar>
                </VaButton>
            </template>
            <template v-if="avatarName != ''">
                <VaDropdownContent class="profile-dropdown__content md:w-60 px-0 py-4 w-full">
                    <VaList v-for="group in options" :key="group.name">
                        <header v-if="group.name"
                            class="uppercase text-[var(--va-secondary)] opacity-80 font-bold text-xs px-4">
                            {{ group.name }}
                        </header>
                        <VaListItem v-for="item in group.list" :key="item.name" v-bind="resolveLinkAttribute(item)"
                            class="menu-item px-4 text-base cursor-pointer h-8">
                            <VaIcon :name="item.icon" class="pr-1" color="secondary"></VaIcon>
                            {{ item.name }}
                        </VaListItem>
                        <VaListSeparator v-if="group.separator" class="mx-3 my-2" />
                    </VaList>
                </VaDropdownContent>
            </template>
        </VaDropdown>
    </template>
    <template v-else>
        <router-link to="/leadIn" class="user-icon">
            <span><i class="fa-solid fa-user"></i></span>
            <span>&nbsp;登录</span>
        </router-link>
    </template>
</template>

<script setup>
import userApi from '@/api/userApi';
import {ref} from 'vue';
import {VaDropdown, VaDropdownContent, VaList, VaListItem, VaListSeparator} from "vuestic-ui";
import {VaButton} from 'vuestic-ui/web-components';

defineProps({
    avatarName: String,
});

function logout() {
    userApi.logout();
}

const options = ref([
    {
        name: 'account',
        separator: true,
        list: [
            {
                name: 'Profile',
                icon: 'fa-circle-user',
                click: {
                    to: "/profile"
                }
            },
            // 没有setting了
            // {
            //     name: 'Settings',
            //     icon: 'fa-gear',
            //     click: {
            //         to: "/settings"
            //     }
            // }
        ]
    },
    {
        name: 'explore',
        separator: true,
        list: [
            {
                name: 'FAQ',
                icon: 'fa-circle-question',
                click: {
                  to: "/faq"
                }
            },
            {
                name: 'Help',
                icon: 'fa-circle-info',
            }
        ]
    },
    {
        name: "",
        separator: false,
        list: [
            {
                name: 'Logout',
                icon: 'fa-sign-out-alt',
                click: {
                    onClick: logout
                }
            }
        ]
    }
]);

const resolveLinkAttribute = (item) => {
    return item.click ? item.click : {}
}

</script>

<style lang="css" scoped>
.user-icon {
    color: azure;
    font-size: 20px;
    justify-content: center;
    align-items: center;
    border-radius: 30%;
    text-decoration: none;
    font-weight: bold;
    transition: background-color 0.3s;
}
</style>

<style lang="scss">
.profile-dropdown {
  cursor: pointer;

  &__content {
    .menu-item:hover {
      background: var(--hover-color);
    }
  }

  &__anchor {
    display: inline-block;
  }
}
</style>