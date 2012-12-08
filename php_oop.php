<?php
/* http://net.tutsplus.com/tutorials/php/object-oriented-php-for-beginners/ */
class MyClass
{
	public $prop1 = "class property";
	public static $count = 0;
	public function __construct()
	{
		echo 'The class "', __CLASS__, '" was initiated!<br/>';
	}
	public function __destruct()
	{
		echo 'The class "', __CLASS__, '" was destroyed!<br/>';
	}
	public function __toString()
	{
		echo "Using the toString method";
		return $this->getProperty();
	}
	public function setProperty($newval)
	{
		return $this->prop1 = $newval;
	}
	protected function getProperty()
	{
		return $this->prop1."<br/>";
	}
    public static function plusOne()
    {
        return "The count is " . ++self::$count . ".<br />";
    }
}
class MyOtherClass extends MyClass
{
	public function __construct()
	{
		parent::__construct(); // call parent class's constructor
		echo "A new constructor in " . __CLASS__ . "<br/>";
	}
	public function newMethod()
	{
		echo "From a new method in " . __CLASS__ . "<br/>";
	}
	public function callProtected()
	{
		return $this->getProperty();
	}
}
//$obj = new MyClass;
//var_dump($obj);
//echo $obj->prop1;
//echo $obj->getProperty();
//$obj->setProperty("new class property");
//echo $obj->getProperty();
//echo $obj; // causes error if try output object as string
//unset($obj);
//$newobj = new MyOtherClass();
//echo $newobj->newMethod();
//echo $newobj->getProperty();
//echo $newobj->callProtected();

do
{
    echo MyClass::plusOne();
} while ( MyClass::$count < 10 );

// 1. methods to get and set value of class property prop1
// 2. magic methods - __construct() and __destruct() for when object is constructed and destroyed
// 3. class inheritance
//    inheriting a class
//    overwriting inherited methods
//    preserving inherited method while adding functionality - use ::
// 4. scope of properties and methods
//    public - accessible from anywhere, within class and externally
//    protected - accessible within class or descendant classes
//    private - accessible within class only
// 5. static properties and methods
//    use ::
// 6. DocBlock
// 7. Procedural vs. OOP code
//    with OOP, don't need to pass variables from function to function
//    can easily package classes as class.classname.inc.php
?>
