#include <stdarg.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>
#include "main.h"

/**
 * _printf - produces output according to a format
 *  @format: a string containing normal
 *  sequence(s) of characters to print as-is, and
 *  special character sequence(s) to determine how to print the next arguments.
 *
 *  Return: the number of characters printed,
 *  excluding the string-terminating null character
 */
int _printf(const char *format, ...)
{
	int i, j, ret = 0, ret_count = 0, bytes_written = 0;
	va_list ap;

	va_start(ap, format);	/*initialize argument pointer*/
	for (i = 0; format[i]; i++)
	{
		if (format[i] == '%')	/*when a % character is encountered*/
		{
			ret = print_any2(ap, format[++i]);	/*ret stores the number of bytes*/
			/*written by the call to print_any2*/
			va_end(ap);	/*end the use of ap*/
			va_start(ap, format);	/*re-initialize ap*/
			bytes_written += ret;
			if (ret > 0)
			{
				if (format[i] != '%')	/*ret_count keeps track of*/
					/*how many times print_any2*/
					/*printed a char or string, apart from %*/
					ret_count += 1;
				for (j = 0; j < ret_count; j++)	/*reset ap to the correct*/
					/*position after being used in print_any2*/
				{
					va_arg(ap, int);
				}
			}
			else
			{
				write(1, (format + i), 1);
				bytes_written++;
			}
		}
		else
		{
			write(1, (format + i), 1);
			bytes_written += 1;
		}
		ret = 0;
	}
	va_end(ap);
	return (bytes_written);
}



/**
 * print_any2 - prints optional arguments based on the format specified by c
 * @ap: an argument pointer
 * @c: character specifying how an optional argument should be printed
 *
 * Return: the number of bytes written/printed to STDOUT
 */
int print_any2(va_list ap, char c)
{
	int bytes_written;
	char *ptc;

	bytes_written = 0;
	switch (c)
	{
		case 'c':
			write(1, c2s((va_arg(ap, int)), 0, 0), 1);
			bytes_written += 1;
			break;
		case 's':
			ptc = va_arg(ap, char *);
			write(1, ptc, _strlen(ptc));
			va_arg(ap, char *);
			bytes_written += _strlen(ptc);
			break;
		case '%':
			write(1, "%", 1);
			bytes_written += 1;
			break;
	}

	return (bytes_written);
}




/**
 * c2s - converts a character constant, or single-digit integer, to a string.
 * @c: a char
 * @i: an int
 * @flag: an int indicating whether the
 * output is from a char (0), or from an int (1).
 *
 * Return: a pointer to a string
 */
char *c2s(char c, int i, int flag)
{
	char *ptc;
	char arr[2];

	ptc = arr;
	if (flag)		/*for when the output string is to be from an integer*/
	{
		(void)c;	/*declare the variable, c, as unsused*/
		ptc[0] = i + '0';
		ptc[1] = '\0';
	}
	else
	{
		(void)i;
		ptc[0] = c;
		ptc[1] = '\0';
	}

	return (ptc);
}



/**
 * _strlen - returns the length of a string
 * @s: pointer to char type
 *
 * Return: an integer length of the argument
 */
int _strlen(char *s)
{
	int len, shift = 0;

	for (len = 0; *(s + shift);)
	{
		len++;
		shift++;
	}

	return (len);
}
