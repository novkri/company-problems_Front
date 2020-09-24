<template>
  <div>
    <div class="containerUsers" v-if="mounted">
      <ul>
        <li>
          <div class="member">
            <div class="member-icon">
              <award-icon size="1.5x" class="custom-class"></award-icon>
            </div>
            1. {{leaderReduced.surname}} {{leaderReduced.name}} {{leaderReduced.father_name}}
          </div>
          <div class="close">
            <button type="button" id="close" class="close" data-dismiss="modal" 
              @click="removeLeader(leaderReduced.id, val)">
              <span aria-hidden="true"  style="font-size: 20px;">&times;</span>
            </button>
          </div>
        </li>

        <div v-if="members !== 0">
          <li v-for="(member, idx) in members" :key="idx">
            <div class="member">
              <div class="member-icon">
                <user-icon size="1.5x" class="custom-class" id="iconUser"></user-icon>
              </div>
              {{idx+2}}. {{member.surname}} {{member.name[0]}}. {{member.father_name ? member.father_name[0]+'.' : ''}}
            </div>
            <div class="close">
              <!--  -->
              <button type="button" id="close" class="close" data-dismiss="modal"
                @click="removeUserFromGroup(member.id, val)" data-toggle="modal" data-target="#groupDeleteUser">
                <span aria-hidden="true" style="font-size: 20px;">&times;</span>
              </button>
            </div>
          </li>
        </div>
      </ul>
    </div>
    
    <div v-else>
      <half-circle-spinner
      :animation-duration="1500"
        :size="50"
        color="#92D2C3"
      />
    </div>
    <GroupDeleteUser v-if="openDeleteGroup" :val="paramsModal" @deleteGroup="deleteGroup(param = $event)" />
  </div>

</template>

<script>
 import { HalfCircleSpinner } from 'epic-spinners'
  import GroupDeleteUser from '@/components/Groups/Users/DeleteUser'
  import {
    mapGetters
  } from 'vuex'
  import {
    UserIcon,
    AwardIcon,
  } from 'vue-feather-icons'

  export default {
    name: 'members',
    props: ['val'],
    data: () => ({
      mounted: false,
      openDeleteGroup: false,
      paramsModal: {}
    }),
    components: {
      UserIcon,
      AwardIcon,

      GroupDeleteUser,

      HalfCircleSpinner
    },
    computed: {
      ...mapGetters(['error', 'error404', 'members', 'usersNoGroup', 'leaderReduced', 'allUsersReduced']),
    },

    async mounted() {
      await this.$store.dispatch('getMembers', this.val)
      await this.$store.dispatch('getLeader', this.val)
      this.mounted = true
    },
    // watch: {
    //   leaderReduced(value) {
    //     console.log(value);

    //   }
    // },
    methods: {
      removeUserFromGroup(uid, groupId) {
        this.openDeleteGroup = true
        this.paramsModal = {
          id: groupId,
          uid
        }
      },
      async removeLeader(uid, groupId) {
        await this.$store.commit('setError404', '')
        this.$store.dispatch('removeUserFromGroup', {
          id: groupId,
          uid
        })
    }
    }
  }
</script>

<style lang="scss" scoped>
.half-circle-spinner {
  margin: 10px auto;
}
  .containerUsers {
    display: flex;
    flex-direction: column;
    margin: 0;
  }

  ul {
    padding: 0;
    list-style: none;
    padding-right: 24px;

    font-family: 'GothamPro';
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #4F4F4F;
  }

  li {
    display: flex;
    width: 100%;
    justify-content: space-between;

    padding: 30px 24px;
    border-bottom: 1px solid #DEDEDE;
  }

  li:last-child {
    border: none;
    padding-bottom: 20px;
  }

  .member {
    display: flex;
    align-items: center;

    .member-icon {
      padding-right: 10px;
    }
  }
  // @media (max-width: 1500px) {
  //   #headingOneAdd {
  //     height: auto;
  //   }
  // }
</style>>