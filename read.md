

## Navigation

1. In Render Method

```
import { Redirect } from 'react-router'
...
...
 if(navigate_my_jobs){
      return <Redirect to="/myjobs" push={true} />
    }
```

2. 

```
import { Link , Route } from 'react-router-dom'
...
...
<Link to="/public">Public Page</Link>
<Link to="/protected">Protected Page</Link>
<Route path="/public" component={Public}/>
<Route path="/login" component={Login}/>
```

3.

```
 this.props.history.push('/postjob')
```
