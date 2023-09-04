<template>
    <div class="position-relative" v-if="image">
        <img :src="image">
    </div>
</template>
<script type="text/javascript">
    export default {
        props: {
            preview: {
                type: [String, File],
                default: null
            }
        },
       data() {
            return {
                image: null
            }
        },
        created() {
            this.setPreview()
        },
        watch: {
            'preview': 'setPreview'
        },
        methods: {
            setPreview() {
                if (this.preview instanceof File) {
                    const fileReader = new FileReader();
                    fileReader.onload = (event) => {
                        this.image = event.target.result;
                    };
                    fileReader.readAsDataURL(this.preview)
                } else if (typeof this.preview === 'string') {
                    this.image = `${process.env.VUE_APP_S3_URL}/${this.preview}`;
                } else this.image = null;
            }
        }
    }
</script>