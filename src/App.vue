<template>
  <div id="app">
    <component :is="layout"><router-view /> </component>
  </div>
</template>

<script>
import MainLayout from '@/layouts/Layout'
import NoneLayout from '@/layouts/NoLayout'

  export default {
    components: {
      MainLayout,
      NoneLayout
    },
    computed: {
      layout() {
        return (this.$route.meta.layout) + '-layout';
      }
    },
  }

</script>
<style lang="scss">
  .form-control.input {
    border-radius: 0 10px 10px 0 !important;
    background-color: transparent;
  }


  .tooltip {
  display: block !important;
  z-index: 10000;

  .tooltip-inner {
    background: black;
    color: white;
    border-radius: 16px;
    padding: 5px 10px 4px;
    //     max-width: 460px;
    // max-height: 270px;
  }


  &[x-placement^="top"] {
    margin-bottom: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="bottom"] {
    margin-top: 5px;

    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }


  &.popover {
    $color: #f9f9f9;

    .popover-inner {
      border: none;
      background: $color;
      color: black;
      padding: 16px;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(black, .1);
       width: 460px;
    height: 270px;
          max-width: 460px;
    max-height: 270px;

      div {
        display: flex;
      }
    }

    .popover-arrow {
      border-color: $color;
    }
  }

  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity .15s, visibility .15s;
  }

  &[aria-hidden='false'], &[aria-hidden='false']:focus {
    border: none;
    outline: none;
    visibility: visible;
    opacity: 1;
    transition: opacity .15s;
  }
}
</style>
